import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();

  // Lấy danh sách tất cả các cookie hiện có
  const allCookies = cookieStore.getAll();

  // Duyệt qua từng cookie và set nó về trạng thái xóa
  allCookies.forEach((cookie) => {
    cookieStore.set({
      name: cookie.name,
      value: "",
      expires: new Date(0), // Đặt ngày hết hạn về quá khứ (1970)
      path: "/", // Đảm bảo xóa trên toàn bộ domain
    });
  });

  return NextResponse.json({ message: "Đăng xuất thành công" }, { status: 200 });
}
