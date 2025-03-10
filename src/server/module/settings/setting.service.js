//@ts-check

import { AI_CREDENTIAL_SETTINGS, AI_MODEL_SETTINGS, EMAIL_CREDENTIAL_SETTINGS, INVALID_INPUT_ERR_CODE } from "@/global/utils/constant";
import { HttpError, sanitizeObject } from "@/global/utils/functions";
import { decrypt, encrypt } from "@/server/utils/encryption";
import { Validator } from "node-input-validator";
import striptags from "striptags";
import settingsModel from "./settings.model";

export const updateSetting = async (params) => {
    const v = new Validator(params, {
        key: "required|string",
        value: "required|string",
    });

    let match = await v.check();
    if (!match) {
        throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
    }

    let payload = sanitizeObject({
        key: striptags(params?.key),
        value: encrypt(params?.value)
    })

    let raw = await settingsModel.findOneAndUpdate({ key: payload?.key }, {
        $set: payload
    }, { upsert: true });

    return raw?.toJSON()
}

export const listSettings = async () => {

    let list = await settingsModel.find({})
    let keys = [
        AI_MODEL_SETTINGS,
        AI_CREDENTIAL_SETTINGS,
        EMAIL_CREDENTIAL_SETTINGS
    ]

    let res = keys?.map((n) => {
        return {
            key: n,
            value: decrypt(list?.find((m) => m?.key === n)?.value)
        }
    })


    return res

}

export const getSettings = async (key) => {

    let res = await settingsModel.findOne({ key })

    return {
        key,
        value: decrypt(res?.value)
    }

}