//@ts-check

import { AI_CREDENTIAL_SETTINGS, AI_MODEL_SETTINGS, AI_PROMPT_SETTINGS } from "@/global/utils/constant"
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

    const { value: prompt } = await getSettings(AI_PROMPT_SETTINGS)

    let content = prompt + rawFileData;
    
    const reviewResult = await execOpenAI({
        messages: [
            { role: "system", content: "You are an expert code reviewer." },
            {
                role: "user", content
            }
        ]
    })

    return strToJSObject(reviewResult)

}