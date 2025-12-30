import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    const { ADMIN_ACCOUNT: adminAccount, ADMIN_PASSWORD: adminPassword, SECRET_KEY } = process.env;

    if (
      request.email === adminAccount &&
      request.password === adminPassword &&
      request.name === "admin" &&
      request.type === "a"
    ) {
      const cookieStore = await cookies();
      const payload = {
        email: request.email,
        name: request.name,
        type: request.type,
        scretKey: SECRET_KEY,
      };
      cookieStore.set("access_token", btoa(JSON.stringify(payload)), {
        httpOnly: true, // Bảo mật: Trình duyệt không thể đọc bằng JS (chống XSS)
        secure: process.env.NODE_ENV === "production", // Chỉ gửi qua HTTPS khi ở prod
        sameSite: "lax", // Chống tấn công CSRF
        maxAge: 60 * 60 * 24 * 365, // Hết hạn sau 1 năm (tính bằng giây)
        path: "/", // Có hiệu lực trên toàn bộ trang web
      });

      return NextResponse.json({ message: "Xác thực thành công", verified: true }, { status: 200 });
    }
    return NextResponse.json({ error: "Xác thực thất bại" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi hệ thống: " + error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token");
  try {
    if (token) {
      const decode = atob(token.value);
      const payload = JSON.parse(decode);
      const { ADMIN_ACCOUNT: adminAccount, SECRET_KEY } = process.env;

      if (
        payload.type === "a" &&
        payload.email === adminAccount &&
        payload.name === "admin" &&
        payload.scretKey === SECRET_KEY
      ) {
        return NextResponse.json(
          {
            message: "Xác thực thành công",
            verified: true,
            data: { email: adminAccount, name: payload.name, type: payload.type },
          },
          { status: 200 }
        );
      }
    }
    return NextResponse.json({ error: "Xác thực thất bại" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi hệ thống: " + error }, { status: 500 });
  }
}
