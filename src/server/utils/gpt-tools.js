//@ts-check

import { AI_CREDENTIAL_SETTINGS, AI_MODEL_SETTINGS } from "@/global/utils/constant"
import { strToJSObject } from "@/global/utils/functions"
import OpenAI from "openai"
import { decrypt } from "./encryption"
import { getSettings } from "../module/settings/setting.service"

const execOpenAI = async (payload) => {

    let { value: secret } = await getSettings(AI_CREDENTIAL_SETTINGS)

    const credential = JSON.parse(secret)

    const openai = new OpenAI(credential);

    const { value: model } = await getSettings(AI_MODEL_SETTINGS)

    payload.model = model

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