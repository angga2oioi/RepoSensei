//@ts-check

import { AI_CREDENTIAL_SETTINGS, INVALID_INPUT_ERR_CODE } from "@/global/utils/constant"
import { HttpError, strToJSObject } from "@/global/utils/functions"
import OpenAI from "openai"
import settingsModel from "../module/settings/settings.model"
import { decrypt } from "./encryption"

const execOpenAI = async (payload) => {

    let setting = await settingsModel.findOne({
        key: AI_CREDENTIAL_SETTINGS
    })

    const credential = JSON.parse(decrypt(setting?.value))

    const openai = new OpenAI(credential);

    payload.model = credential?.model

    const data = await openai.chat.completions.create(payload);

    return data?.choices?.[0]?.message?.content
}

export const gptAnalyzeFile = async (rawFileData) => {

    let prompt = `Below are the contents of a file that are part of a Pull Request. Please review the file and only reject if :
1. There is clear typo. 
2. There is a credential exposure.
3. There is a scaling issue like processing millions of requests in a single unoptimized promise.
If you failed to find those criteria, please just accept the PR.
Please provide feedback in JSON format only, without including additional code in your response, to ensure easier parsing.
Schema for the response:
{
    "comment": "Your feedback here",
    "status": "ACCEPT or REJECT"
}
Here is the file:

${rawFileData}
`
    const reviewResult = await execOpenAI({
        messages: [
            { role: "system", content: "You are an expert code reviewer." },
            {
                role: "user", content: prompt
            }
        ]
    })

    return strToJSObject(reviewResult)

}