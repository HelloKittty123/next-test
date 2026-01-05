import { NextRequest, NextResponse } from "next/server";
import { getCurrentLogin } from "./app/api/admin/_libs";

export function middleware(request: NextRequest) {
  const login = getCurrentLogin(request);
  if (login) {
    return NextResponse.next();
  }

  return NextResponse.json({ message: "Xác thực thất bại" }, { status: 401 });
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
