import { NextRequest, NextResponse } from "next/server";
import { getCurrentLogin } from "../_libs";

export async function GET(req: NextRequest) {
  try {
    const currentLogin = getCurrentLogin(req);
    return NextResponse.json(currentLogin, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}
