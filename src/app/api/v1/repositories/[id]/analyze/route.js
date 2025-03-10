//@ts-check

import { SUCCESS_ERR_CODE, SUCCESS_ERR_MESSAGE } from "@/global/utils/constant";
import { parseError } from "@/global/utils/functions";
import { NextResponse } from "next/server";
import {  manuallyAnalyzeRepo } from "@/server/module/repository/repo.service";

export async function PATCH(request, { params }) {
    try {

        const { id } = await params
        
        await manuallyAnalyzeRepo(id)

        return NextResponse.json({
            error: SUCCESS_ERR_CODE,
            message: SUCCESS_ERR_MESSAGE,
        });


    } catch (e) {
        return NextResponse.json(parseError(e), { status: e?.error || 400 });
    }
}
