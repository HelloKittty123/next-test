import { encodeBase64URL } from "@utils";
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
      cookieStore.set("access_token", encodeBase64URL(JSON.stringify(payload)), {
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
