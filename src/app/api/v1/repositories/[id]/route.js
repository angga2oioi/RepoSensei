//@ts-check

import { MANAGE_REPOSITORIES_ROLES, NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE, SUCCESS_ERR_CODE, SUCCESS_ERR_MESSAGE } from "@/global/utils/constant";
import { HttpError, parseError } from "@/global/utils/functions";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateCookies } from "@/server/module/auth/auth.service";
import { canIManage } from "@/server/module/account/account.service";
import { removeRepository } from "@/server/module/repository/repo.service";


export async function DELETE(request, { params }) {
    try {

        const { account, token } = await validateCookies(cookies);
        if (!token) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE);
        }

        const canManage = await canIManage(account?.id, MANAGE_REPOSITORIES_ROLES)
        if (!canManage) {
            throw HttpError(NO_ACCESS_ERR_CODE, NO_ACCESS_ERR_MESSAGE)
        }

        const { id } = await params

        let data = await removeRepository(id)

        return NextResponse.json({
            error: SUCCESS_ERR_CODE,
            message: SUCCESS_ERR_MESSAGE,
            data
        });


    } catch (e) {
        console.log(e)
        console.log(e?.response)
        return NextResponse.json(parseError(e), { status: e?.error || 400 });
    }
}
