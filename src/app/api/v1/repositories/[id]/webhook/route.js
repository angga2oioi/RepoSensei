//@ts-check

import { SUCCESS_ERR_CODE, SUCCESS_ERR_MESSAGE } from "@/global/utils/constant";
import { parseError } from "@/global/utils/functions";
import { NextResponse } from "next/server";
import { handleWebhook } from "@/server/module/repository/repo.service";


export async function POST(request, { params }) {
    try {


        const { id } = await params
        const body = await request.json();
        handleWebhook(id, body?.pullrequest?.id)
            .catch((e) => console.log(e))

        return NextResponse.json({
            error: SUCCESS_ERR_CODE,
            message: SUCCESS_ERR_MESSAGE,
        });


    } catch (e) {
        return NextResponse.json(parseError(e), { status: e?.error || 400 });
    }
}
