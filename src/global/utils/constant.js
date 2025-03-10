export const SUCCESS_ERR_CODE = 0;
export const SUCCESS_ERR_MESSAGE = "Success";

export const UNKNOWN_ERR_CODE = 500;
export const UNKNOWN_ERR_MESSAGE = "Unknown Error";

export const NOT_FOUND_ERR_CODE = 404;
export const NOT_FOUND_ERR_MESSAGE = "Not Found";

export const NO_ACCESS_ERR_CODE = 401;
export const NO_ACCESS_ERR_MESSAGE = "No Access";

export const INVALID_INPUT_ERR_CODE = 400;
export const INVALID_INPUT_ERR_MESSAGE = "Bad Request";

export const MANAGE_ACCOUNT_ROLES = "MANAGE_ACCOUNT";
export const MANAGE_REPOSITORIES_ROLES = "MANAGE_REPOSITORIES";
export const MANAGE_CREDENTIALS_ROLES = "MANAGE_CREDENTIALS";
export const MANAGE_SETTINGS_ROLES = "MANAGE_SETTINGS";

export const ACCOUNT_COOKIE_NAME = "ACCOUNT";
export const REFRESH_TOKEN_COOKIE_NAME = "REFRESH_TOKEN";
export const CSRF_TOKEN_COOKIE_NAME = "CSRF_TOKEN";

export const STRONG_PASSWORD_SCORE="Strong"

export const AI_CREDENTIAL_SETTINGS="AI_CREDENTIAL"
export const AI_MODEL_SETTINGS="AI_MODEL"
export const AI_PROMPT_SETTINGS="AI_PROMPT"
export const EMAIL_CREDENTIAL_SETTINGS="EMAIL_CREDENTIAL"

export const USERNAME_PASSWORD_CREDENTIAL_TYPE="USERNAME_PASSWORD"

export const BITBUCKET_REPO_TYPE="BITBUCKET"

export const COOKIE_OPTIONS = {
    httpOnly: true,
    maxAge: 60 * 60,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "Strict",
};

export const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    maxAge: 24 * 60 * 60,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "Strict",
};