//@ts-check


import { BITBUCKET_REPO_TYPE, INVALID_INPUT_ERR_CODE, NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE, USERNAME_PASSWORD_CREDENTIAL_TYPE } from "@/global/utils/constant";
import { HttpError } from "@/global/utils/functions";
import { Validator } from "node-input-validator";
import credentialModel from "../credential/credential.model";
import striptags from "striptags";
import repoModel from "./repo.model";
import { createBitbucketWebhook, removeBitbucketWebhook } from "@/server/utils/bitbucket";
import { decrypt } from "@/server/utils/encryption";
import mongoose from "mongoose";

const connectBitbucketRepository = async (params) => {
    const v = new Validator(params, {
        name: "required|string",
        secret: "required|string",
        protocol: "required|string",
        hostname: "required|string",
        gitUrl: "required|string",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    const credential = await credentialModel.findById(params?.secret)
    if (!credential || credential?.type !== USERNAME_PASSWORD_CREDENTIAL_TYPE) {
        throw HttpError(INVALID_INPUT_ERR_CODE, `credential not found`)
    }

    if (!params?.gitUrl?.includes("@bitbucket.org")) {
        throw HttpError(INVALID_INPUT_ERR_CODE, `not a bitbucket url`)
    }

    const secret = JSON.parse(decrypt(credential?.secret))

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const item = params?.gitUrl?.split("/")

        let payload = {
            type: striptags(params?.type),
            name: striptags(params?.name),
            connection: {
                workspace: striptags(item?.[3]),
                repo_slug: striptags(item?.[4])
            },
            secret: credential?._id
        }

        const test = await repoModel.findOne({
            type: payload?.type,
            "connection.workspace": payload.connection.workspace,
            "connection.repo_slug": payload.connection.repo_slug

        })

        if (test) {
            throw HttpError(INVALID_INPUT_ERR_CODE, `Already connected`)
        }

        const raw = await repoModel.create([payload], { session })

        const { uuid } = await createBitbucketWebhook({
            webhookUrl: `${params?.protocol}//${params?.hostname}/api/v1/repo/${raw?.[0]?._id?.toString()}/webhook`,
            workspace: payload?.connection?.workspace,
            repo_slug: payload?.connection?.repo_slug,
            username: secret?.username,
            password: secret?.password,
        })

        await repoModel.findByIdAndUpdate(raw?.[0]?._id?.toString(), {
            $set: {
                "connection.hookId": uuid
            }
        }, { session })

        await session.commitTransaction()
        return raw?.[0]?.toJSON()

    } catch (e) {
        await session.abortTransaction();
        throw e;
    }

}

export const connectRepository = async (params) => {

    const v = new Validator(params, {
        type: "required|string",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    if (params?.type === BITBUCKET_REPO_TYPE) {
        return await connectBitbucketRepository(params)
    }

    throw HttpError(INVALID_INPUT_ERR_CODE, `Unknown type`)

}

export const removeRepository = async (id) => {

    const raw = await repoModel.findById(id)
    if (!raw) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    const credential = await credentialModel.findById(raw?.secret?.toString())
    if (!credential || credential?.type !== USERNAME_PASSWORD_CREDENTIAL_TYPE) {
        throw HttpError(INVALID_INPUT_ERR_CODE, `credential not found`)
    }

    const secret = JSON.parse(decrypt(credential?.secret))

    await removeBitbucketWebhook({
        hookId: raw?.connection?.hookId,
        workspace: raw?.connection?.workspace,
        repo_slug: raw?.connection?.repo_slug,
        username: secret?.username,
        password: secret?.password,
    })

    await repoModel.findByIdAndDelete(id)

    return null

}

const buildRepositorySearchQuery = (params) => {
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


export const paginateRepository = async (query, sortBy = "createdAt:desc", limit = 10, page = 1) => {

    let queryParams = buildRepositorySearchQuery(query)

    let list = await repoModel.paginate(queryParams, { sortBy, limit, page })

    list.results = list?.results?.map((n) => {
        let json = n?.toJSON()
        return json
    })

    return list

}