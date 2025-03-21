//@ts-check
import { UNKNOWN_ERR_CODE, UNKNOWN_ERR_MESSAGE } from "./constant";
import striptags from "striptags";

const buildError = ({ error, message }) => {
    const err = new Error(message || UNKNOWN_ERR_CODE);
    err.error = error || UNKNOWN_ERR_MESSAGE;

    return err;
};

export const HttpError = (error, message) => {
    if (error.hasOwnProperty("error")) {
        return buildError(error);
    }

    let msg = message || UNKNOWN_ERR_MESSAGE;

    if (typeof message === typeof {}) {
        let key = Object.keys(message)[0];
        msg = message[key].message;
    }

    return buildError({ error, message: msg });
};

export const parseError = (e) => {
    return {
        error: e.error || UNKNOWN_ERR_CODE,
        message: e?.response?.data?.message || e.message || UNKNOWN_ERR_MESSAGE,
    };
};

export const sanitizeObject = (params) => {
    let obj = { ...params };

    Object.keys(obj).forEach(
        (k) => (obj[k] === undefined || obj[k] === null) && delete obj[k]
    );

    return obj;
};

export const num2Int = (number) => {
    if (isNaN(number)) {
        return 0;
    }

    return parseInt(number);
};

export const sanitizeEmail = (email) => {
    const [name, domain = ""] = striptags(email?.toString())?.split("@")

    let realName = name?.split("+")?.[0]

    let realEmail = `${realName}@${domain}`
    return realEmail
}

export const minMaxNum = (limit, min, max) => {

    limit = num2Int(limit);

    if (min && limit < num2Int(min)) {
        return num2Int(min);
    }

    if (max && limit > num2Int(max)) {
        return num2Int(max);
    }

    return limit;
};

export const parseSortBy = (sortBy) => {
    let sortField = {};

    sortBy.split(",").forEach((sortOption) => {
        const [key, order] = sortOption.split(":");
        sortField[key] = order === "desc" ? -1 : 1;
    });

    return sortField;
};

export const createSlug = (string) => {
    return string
        .normalize("NFD") // Normalize accented characters
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/[+(){}\[\]]/g, " ") // Convert `+`, `()`, `{}`, `[]` to spaces
        .trim() // Trim spaces *after* replacing special characters
        .toLowerCase()
        .replace(/\s+/g, "-") // Convert spaces to hyphens
        .replace(/[^\w-]/g, "") // Remove non-word characters except "-"
        .replace(/-{2,}/g, "-"); // Prevent multiple consecutive "-"
};

export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const strToJSObject = (text) => {
    if (typeof text !== "string") return {};

    text = text.trim();

    try {
        return JSON.parse(text);
    } catch (e) {
        let s1 = text?.split(`{`);
        s1?.shift();

        let s2 = s1?.join("{").split("}");
        s2.pop();

        let res = "{" + s2?.join("}") + "}";
        
        try {
            return JSON.parse(res);
        } catch {

            return {}; // If still invalid, return null instead of throwing an error
        }
    }
};