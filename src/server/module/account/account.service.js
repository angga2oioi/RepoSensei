//@ts-check

import { INVALID_INPUT_ERR_CODE, MANAGE_ACCOUNT_ROLES, MANAGE_CREDENTIALS_ROLES, MANAGE_REPOSITORIES_ROLES, MANAGE_SETTINGS_ROLES, NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE } from "@/global/utils/constant";
import { HttpError, minMaxNum } from "@/global/utils/functions";
import { Validator } from "node-input-validator";
import accountModel from "./account.model";
import * as bcrypt from "bcryptjs";
import Randomstring from "randomstring";
import striptags from "striptags";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types

export const setupAccount = async (params) => {
    const v = new Validator(params, {
        username: "required|string",
        password: "required|string",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    // create new account
    const account = await createAccount({
        username: params?.username,
        roles: [
            MANAGE_ACCOUNT_ROLES,
            MANAGE_REPOSITORIES_ROLES,
            MANAGE_CREDENTIALS_ROLES,
            MANAGE_SETTINGS_ROLES
        ]
    })

    // create new password for that account
    const password = await resetPassword(account?.id)

    // update the password with one that submitted
    await changePassword(account?.id, {
        oldpassword: password,
        newpassword: params?.password,
        repassword: params?.password,
    })

    return account
}

export const createAccount = async (params) => {
    const v = new Validator(params, {
        username: "required|string",
        roles: "arrayUnique",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    let password = Randomstring.generate(12)
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        let account = await accountModel.create([
            {
                username: striptags(params?.username),
                roles: params?.roles,
                password: hash
            }
        ], { session })

        await session.commitTransaction()
        return account?.[0]?.toJSON()

    } catch (e) {
        await session.abortTransaction();
        throw e;
    }

}

export const resetPassword = async (id) => {
    const account = await accountModel.findById(id)
    if (!account) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    const newPassword = Randomstring.generate(6)

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(newPassword, salt);

    await accountModel.findByIdAndUpdate(id, {
        $set: {
            password: hash
        }
    })

    return newPassword
}

export const changePassword = async (id, params) => {
    const account = await accountModel.findById(id)
    if (!account) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    const v = new Validator(params, {
        oldpassword: "required",
        newpassword: "required",
        repassword: "required",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    const isPasswordMatch = bcrypt.compareSync(
        params?.oldpassword,
        account?.password
    );

    if (!isPasswordMatch) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE);
    }

    if (params?.newpassword !== params?.repassword) {
        throw HttpError(INVALID_INPUT_ERR_CODE, `password did not match`);
    }

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(params?.newpassword, salt);

    await accountModel.findByIdAndUpdate(id, {
        $set: {
            password: hash
        }
    })

    return null
}

export const patchAccountRole = async (id, roles) => {
    const account = await accountModel.findById(id)
    if (!account) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    await accountModel.findByIdAndUpdate(id, {
        $set: {
            roles
        }
    })

    return null
}

export const removeAccount = async (id) => {
    const account = await accountModel.findById(id)
    if (!account) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    await accountModel.findByIdAndDelete(id)


    return null
}

const buildAccountSearchQuery = (params) => {

    let query = {}

    if (params?.search) {
        query.username = {
            $regex: params?.search,
            $options: "i"
        }
    }

    if (params?.roles) {
        query.roles = {
            $in: params?.roles
        }
    }

    return query

}

export const paginateAccount = async (query, sortBy = "createdAt:desc", limit = 10, page = 1) => {

    let queryParams = buildAccountSearchQuery(query)
    page = minMaxNum(page, 1)
    limit = minMaxNum(limit, 1, 50)

    let res = await accountModel.paginate(queryParams, { sortBy, limit, page });

    let list = {
        results: res?.results?.map((n) => {
            return {
                id: n?._id?.toString(),
                username: n?.username,
                roles: n?.roles,
            }
        }),
        page,
        totalResults: res.total,
        totalPages: res.pages,
    };

    return list;
}

export const findAccountById = async (id) => {
    const account = await accountModel.findById(id)
    if (!account) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    let r = account?.toJSON()
    delete r.password

    return r
}

export const canIManage = async (id, role) => {

    const account = await accountModel.findById(id)
    if (!account) {
        return false
    }

    if (account?.roles?.includes(role)) {
        return true
    }

    return false

}
