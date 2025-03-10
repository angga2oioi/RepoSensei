//@ts-check

import { INVALID_INPUT_ERR_CODE, USERNAME_PASSWORD_CREDENTIAL_TYPE } from "@/global/utils/constant";
import { HttpError } from "@/global/utils/functions";
import { Validator } from "node-input-validator";
import credentialModel from "../credential/credential.model";
import { decrypt } from "@/server/utils/encryption";
import mongoose from "mongoose";
import striptags from "striptags";
import repoModel from "./repo.model";
import { approveAndMergeBitbucketPR, createBitbucketWebhook, downloadFileFromBitbucketRepo, execBitbucketGet, getBitbucketPullRequest, rejectBitbucketPR } from "@/server/utils/bitbucket";
import { gptAnalyzeFile } from "@/server/utils/gpt-tools";

export const connectBitbucketRepository = async (params) => {
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
                repo_slug: striptags(item?.[4])?.replace(".git", "")
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
            webhookUrl: `${params?.protocol}//${params?.hostname}/api/v1/repositories/${raw?.[0]?._id?.toString()}/webhook`,
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

export const analyzeBitbucketPullRequest = async (params, pr) => {
    const allowedExtensions = [".js", ".jsx", ".ts", ".tsx", ".rs", ".py", ".java", ".go", ".rb", ".cpp", ".cs"];

    let { values } = await execBitbucketGet({ ...params, url: pr?.links?.diffstat?.href })

    let files = values?.filter((n) => {
        let filePath = n?.new?.path || n?.old?.path; // Get the file path
        return filePath && allowedExtensions.some(ext => filePath.endsWith(ext));
    })?.map((n) => {
        return {
            url: n?.new?.links?.self?.href,
            path: n?.new?.path
        }
    });

    let results = []
    for (const file of files) {
        let rawFileData = await downloadFileFromBitbucketRepo({ ...params, url: file?.url })
        let res = await gptAnalyzeFile(rawFileData)

        if (res?.status) {
            results.push({
                comment: `file : ${file?.path}\n${res?.comment}`,
                status: res?.status
            })
        }
    }

    return results

}

export const handleBitbucketWebhook = async (repo, prId) => {

    const credential = await credentialModel.findById(repo?.secret)
    if (!credential || credential?.type !== USERNAME_PASSWORD_CREDENTIAL_TYPE) {
        throw HttpError(INVALID_INPUT_ERR_CODE, `credential not found`)
    }

    const secret = JSON.parse(decrypt(credential?.secret))

    let params = {
        workspace: repo?.connection?.workspace,
        repo_slug: repo?.connection?.repo_slug,
        username: secret?.username,
        password: secret?.password,
        prId
    }

    let pr = await getBitbucketPullRequest(params)

    let results = await analyzeBitbucketPullRequest(params, pr)

    const rejected = results?.filter((res) => res?.status !== "ACCEPT")
    if (rejected?.length > 0) {
        let comment = rejected?.map((n) => {
            return n?.comment
        })?.join("\n")

        await rejectBitbucketPR({
            ...params,
            prId,
            comment
        })

        return null
    }

    await approveAndMergeBitbucketPR({
        ...params,
        prId,
    })

    return null
}