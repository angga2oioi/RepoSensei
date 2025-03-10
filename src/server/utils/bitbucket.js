//@ts-check

import { INVALID_INPUT_ERR_CODE } from "@/global/utils/constant";
import { HttpError, sanitizeObject } from "@/global/utils/functions";
import { Validator } from "node-input-validator";
import axios from "axios";

const Axios = axios.create({
    baseURL: `https://api.bitbucket.org/2.0/repositories`,
});

const generateHeaders = (params) => {
    return {
        "Authorization": "Basic " + Buffer.from(params?.username + `:` + params?.password).toString('base64')
    }
}

export const createBitbucketWebhook = async (params) => {
    const v = new Validator(params, {
        webhookUrl: "required|string",
        workspace: "required|string",
        repo_slug: "required|string",
        username: "required|string",
        password: "required|string",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    let url = `/${params?.workspace}/${params?.repo_slug}/hooks`

    let payload = {
        description: "Webhook for PR",
        url: params?.webhookUrl,
        active: true,
        events: ["pullrequest:updated", "pullrequest:created", "pullrequest:fulfilled"]
    }

    const { data } = await Axios.post(url, payload, {
        headers: generateHeaders(params)
    })

    return data
}

export const removeBitbucketWebhook = async (params) => {
    const v = new Validator(params, {
        hookId: "required|string",
        workspace: "required|string",
        repo_slug: "required|string",
        username: "required|string",
        password: "required|string",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    let url = `/${params?.workspace}/${params?.repo_slug}/hooks/${params?.hookId}`

    await Axios.delete(url, {
        headers: generateHeaders(params)
    })

    return null
}


export const getBitbucketPullRequest = async (params) => {
    const v = new Validator(params, {
        workspace: "required|string",
        repo_slug: "required|string",
        username: "required|string",
        password: "required|string",
        prId: "required"
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    let url = `/${params?.workspace}/${params?.repo_slug}/pullrequests/${params?.prId}`

    let { data } = await Axios.get(url, {
        params: sanitizeObject({
            page: params?.page
        }),
        headers: generateHeaders(params)
    })

    return data
}

export const listBitbucketPullRequest = async (params) => {
    const v = new Validator(params, {
        workspace: "required|string",
        repo_slug: "required|string",
        username: "required|string",
        password: "required|string",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    let url = `/${params?.workspace}/${params?.repo_slug}/pullrequests`

    let { data } = await Axios.get(url, {
        params: sanitizeObject({
            page: params?.page
        }),
        headers: generateHeaders(params)
    })

    return data
}

export const listAllBitbucketPullRequests = async (params) => {

    let page = 1
    let results = []
    while (true) {
        let list = await listBitbucketPullRequest({ ...params, page })
        if (list?.values?.length < 1) {
            break;
        }

        results = [
            ...results,
            ...(list?.values || [])
        ]

        page += 1
    }

    return results

}

export const listBitbucketPRDiffStat = async (params) => {
    const v = new Validator(params, {
        workspace: "required|string",
        repo_slug: "required|string",
        username: "required|string",
        password: "required|string",
        prId: "required",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }


    let url = `https://api.bitbucket.org/2.0/repositories/${params?.workspace}/${params?.repo_slug}/pullrequests/${params?.prId}/diffstat`

    try {
        let { data } = await axios.get(url, {
            headers: generateHeaders(params)
        })

        return data
    } catch (e) {
        console.log(e?.response)
        throw e
    }
}

export const listAllBitbucketPRDiffStats = async (params) => {

    let page = 1
    let results = []
    while (true) {
        let list = await listBitbucketPRDiffStat({ ...params, page })
        // if (list?.values?.length < 1) {
        //     break;
        // }

        results = [
            ...results,
            ...(list?.values || [])
        ]
        break;
        page += 1
    }

    return results

}

export const downloadFileFromBitbucketRepo = async (params) => {
    const v = new Validator(params, {
        url: "required|string",
        username: "required|string",
        password: "required|string",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    let { data } = await axios({
        url: params?.url,
        method: 'GET',
        responseType: "arraybuffer",
        headers: generateHeaders(params)
    })

    return data

}

export const rejectBitbucketPR = async (params) => {
    const v = new Validator(params, {
        workspace: "required|string",
        repo_slug: "required|string",
        username: "required|string",
        password: "required|string",
        prId: "required",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    let rejectUrl = `/${params?.workspace}/${params?.repo_slug}/pullrequests/${params?.prId}/decline`
    await Axios.post(rejectUrl, {}, {
        headers: generateHeaders(params)
    })

    let commentUrl = `/${params?.workspace}/${params?.repo_slug}/pullrequests/${params?.prId}/comments`
    let payload = {
        content: {
            raw: params?.comment
        }
    }

    await Axios.post(commentUrl, payload,
        {
            headers: generateHeaders(params)
        })

    return null
}

export const approveAndMergeBitbucketPR = async (params) => {

    const v = new Validator(params, {
        workspace: "required|string",
        repo_slug: "required|string",
        username: "required|string",
        password: "required|string",
        prId: "required",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    let approveUrl = `/${params?.workspace}/${params?.repo_slug}/pullrequests/${params?.prId}/approve`
    await Axios.post(approveUrl, {}, {
        headers: generateHeaders(params)
    })

    let mergeUrl = `/${params?.workspace}/${params?.repo_slug}/pullrequests/${params?.prId}/merge`
    let payload = {
        "message": "Merging PR",
        "merge_strategy": "merge_commit"
    }

    await Axios.post(mergeUrl, payload,
        {
            headers: generateHeaders(params)
        })

    return null
}

export const execBitbucketGet = async (params) => {
    const v = new Validator(params, {
        workspace: "required|string",
        repo_slug: "required|string",
        username: "required|string",
        password: "required|string",
        url: "required|string",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    const { data } = await axios.get(params?.url, {
        headers: generateHeaders(params)
    })

    return data
}