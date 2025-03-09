//@ts-check

import { INVALID_INPUT_ERR_CODE } from "@/global/utils/constant";
import { HttpError } from "@/global/utils/functions";
import { Validator } from "node-input-validator";
import axios from "axios";
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

    let url = `https://api.bitbucket.org/2.0/repositories/${params?.workspace}/${params?.repo_slug}/hooks`

    let payload = {
        description: "Webhook for PR",
        url: params?.webhookUrl,
        active: true,
        events: ["pullrequest:updated", "pullrequest:created"]
    }

    await axios.post(url, payload, {
        auth: {
            username: params?.username,
            password: params?.password,
        },
    })

    return null
}