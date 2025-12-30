import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file." }, { status: 400 });
    }

    // Chuyển đổi file thành Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Xác định đường dẫn lưu file (Thư mục 'uploads' tại root dự án)
    const uploadDir = path.join(process.cwd(), "data", "resources");

    // Kiểm tra và tạo thư mục nếu chưa tồn tại
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // Đặt tên file (ví dụ: timestamp + tên gốc để tránh trùng)
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    // Ghi file vào hệ thống
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      message: "Upload thành công!",
      fileName: fileName,
    });
  } catch (error) {
    console.error("Lỗi upload:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi upload file." }, { status: 500 });
  }
}
