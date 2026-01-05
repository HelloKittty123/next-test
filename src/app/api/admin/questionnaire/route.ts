import fs from "fs";
import fsPromise from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File không được để trống." }, { status: 400 });
    }

    const fileExtension = path.extname(file.name); // Lấy đuôi .xlsx, .xls, v.v.
    if (fileExtension !== ".xlsx") {
      return NextResponse.json({ error: "File phải có định dạng .xlsx." }, { status: 400 });
    }

    // 1. Xác định đường dẫn thư mục
    const uploadDir = path.join(process.cwd(), "data", "questionnaire");

    // 2. Kiểm tra và tạo thư mục nếu chưa tồn tại
    try {
      await fsPromise.access(uploadDir);
    } catch {
      await fsPromise.mkdir(uploadDir, { recursive: true });
    }

    // 3. Xóa sạch tất cả file cũ trong thư mục trước khi upload file mới
    const files = await fsPromise.readdir(uploadDir);
    for (const existingFile of files) {
      await fsPromise.unlink(path.join(uploadDir, existingFile));
    }

    // 4. Chuyển đổi file thành Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const newFileName = `questions${fileExtension}`;
    const filePath = path.join(uploadDir, newFileName);

    // 6. Ghi file mới vào hệ thống
    await fsPromise.writeFile(filePath, buffer);

    return NextResponse.json({
      message: "Upload file mới thành công!",
    });
  } catch (error) {
    console.error("Lỗi upload:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi upload file." }, { status: 500 });
  }
}

export async function GET() {
  try {
    // 1. Xác định đường dẫn tuyệt đối đến file Excel
    // process.cwd() trả về đường dẫn thư mục gốc của project
    const filePath = path.join(process.cwd(), "data", "questionnaire", "questions.xlsx");

    // 2. Kiểm tra xem file có tồn tại không
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Không có dữ liệu." }, { status: 404 });
    }

    // 3. Đọc file vào Buffer
    const fileBuffer = fs.readFileSync(filePath);

    // 4. Dùng thư viện xlsx để parse dữ liệu
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    // Lấy sheet đầu tiên
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Chuyển đổi sang JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    return NextResponse.json(jsonData);
  } catch (error) {
    console.error("Error reading excel:", error);
    return NextResponse.json({ error: "Lỗi hệ thống: " + error }, { status: 500 });
  }
}
