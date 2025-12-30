import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_ROUTE } from "../constants/common";


export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  // if (!request.cookies.get("access_token") && !PUBLIC_ROUTE.includes(url)) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }
  return NextResponse.next();
}

