//@ts-check


import { BITBUCKET_REPO_TYPE, INVALID_INPUT_ERR_CODE, NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE, USERNAME_PASSWORD_CREDENTIAL_TYPE } from "@/global/utils/constant";
import { HttpError } from "@/global/utils/functions";
import { Validator } from "node-input-validator";
import credentialModel from "../credential/credential.model";
import repoModel from "./repo.model";
import { listAllBitbucketPullRequests, removeBitbucketWebhook } from "@/server/utils/bitbucket";
import { decrypt } from "@/server/utils/encryption";
import { connectBitbucketRepository, handleBitbucketWebhook } from "./bitbucket.repository.service";

export const connectRepository = async (params) => {

    const v = new Validator(params, {
        type: "required|string",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    if (params?.type === BITBUCKET_REPO_TYPE) {
        let res = await connectBitbucketRepository(params)
        manuallyAnalyzeRepo(res?.id?.toString())
            .catch((e) => console.log(e))

        return res
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

    if (raw?.type === BITBUCKET_REPO_TYPE) {
        removeBitbucketWebhook({
            connection:raw?.connection,
            secret,
        }).catch((e) => console.log(e))
    }

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


export const handleWebhook = async (id, prId) => {

    if (!prId) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    const repo = await repoModel.findById(id)
    if (!repo) {
        throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
    }

    if (repo?.type === BITBUCKET_REPO_TYPE) {
        await handleBitbucketWebhook(repo, prId)
    }

    return null

}

export const manuallyAnalyzeRepo = async (id) => {
    let repo = await repoModel.findById(id)
    if (!repo) {
        return null
    }

    const credential = await credentialModel.findById(repo?.secret)
    if (!credential) {
        throw HttpError(INVALID_INPUT_ERR_CODE, `credential not found`)
    }

    const secret = JSON.parse(decrypt(credential?.secret))

    if (repo?.type === BITBUCKET_REPO_TYPE) {
        if (credential?.type !== USERNAME_PASSWORD_CREDENTIAL_TYPE) {
            return null
        }

        let params = {
            connection:repo?.connection,
            secret,
        }

        let prList = await listAllBitbucketPullRequests(params)
        for (const pr of prList) {
            await handleWebhook(id, pr?.id)
        }
    }

    return null
}