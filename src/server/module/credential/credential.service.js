//@ts-check

import { INVALID_INPUT_ERR_CODE, NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE, USERNAME_PASSWORD_CREDENTIAL_TYPE } from "@/global/utils/constant";
import { createSlug, HttpError, sanitizeObject } from "@/global/utils/functions";
import { Validator } from "node-input-validator";
import credentialModel from "./credential.model";
import striptags from "striptags";
import { decrypt, encrypt } from "@/server/utils/encryption";

const generateSlug = async (name, count = 0) => {

    const slug = createSlug(name + count || "")
    let test = await credentialModel.findOne({
        slug
    })

    if (test) {
        return generateSlug(name, count + 1)
    }

    return slug
}

const generateUsernamePasswordSecret = async (params) => {
    const v = new Validator(params, {
        username: "required|string",
        password: "required|string",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    return encrypt(JSON.stringify({
        username: params?.username,
        password: params?.password
    }))
}

export const createCredential = async (params) => {
    const v = new Validator(params, {
        type: "required|string",
        name: "required|string",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    const slug = await generateSlug(params?.name)

    let payload = sanitizeObject({
        type: striptags(params?.type),
        name: striptags(params?.name),
        slug,
    })

    if (payload?.type === USERNAME_PASSWORD_CREDENTIAL_TYPE) {
        payload.secret = await generateUsernamePasswordSecret(params)
    } else {
        throw HttpError(INVALID_INPUT_ERR_CODE, `unknown type`)
    }

    let raw = await credentialModel.create(payload)
    return raw?.toJSON()
}

export const findCredentialById = async (id) => {
    const raw = await credentialModel.findById(id)
    if (!raw) {
        return null
    }

    return raw?.toJSON()
}

export const removeCredential = async (id) => {
    const raw = await credentialModel.findByIdAndDelete(id)
    if (!raw) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    await credentialModel.findByIdAndDelete(id)
    return null
}

const buildCredentialSearchQuery = (params) => {
    let query = {}

    if (params?.search) {
        query.$or = [
            {
                "name": {
                    $regex: params?.search,
                    $options: "i"
                }
            }
        ]
    }

    return query
}

export const paginateCredential = async (query, sortBy = "createdAt:desc", limit = 10, page = 1) => {

    let queryParams = buildCredentialSearchQuery(query)

    let list = await credentialModel.paginate(queryParams, { sortBy, limit, page })

    list.results = list?.results?.map((n) => {
        let json = n?.toJSON()
        delete json.secret
        return json
    })

    return list

}

export const getSecret = async (id) => {
    const raw = await credentialModel.findById(id)
    if (!raw) {
        return null
    }

    return decrypt(raw?.secret)
}