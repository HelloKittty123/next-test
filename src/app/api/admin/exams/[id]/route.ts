import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import fsPromise from "fs/promises";
import * as XLSX from "xlsx";

// Định nghĩa các đường dẫn tuyệt đối an toàn
const DATA_DIR = path.join(process.cwd(), "data");
const CONFIG_PATH = path.join(DATA_DIR, "exams-config.json");
const EXAMS_DIR = path.join(DATA_DIR, "exams");

/**
 * API LẤY CHI TIẾT BỘ ĐỀ THEO ID
 * Cập nhật chuẩn Next.js 15: params phải được await
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. Await params để lấy ID (Bắt buộc trong Next.js 15 để hết log lỗi)
    const { id } = await params;

    // 2. Kiểm tra file cấu hình JSON
    if (!fs.existsSync(CONFIG_PATH)) {
      return NextResponse.json({ error: "Dữ liệu cấu hình không tồn tại" }, { status: 404 });
    }

    const configs = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    const currentConfig = configs.find((c: any) => c.id === id);

    if (!currentConfig) {
      return NextResponse.json({ error: "Không tìm thấy bộ đề này" }, { status: 404 });
    }

    // 3. Kiểm tra và đọc file Excel
    const excelPath = path.join(EXAMS_DIR, currentConfig.excelFile);
    if (!fs.existsSync(excelPath)) {
      return NextResponse.json({ error: "File Excel bộ đề không tồn tại trên đĩa" }, { status: 404 });
    }

    // Dùng Buffer để đọc file ổn định hơn trên Windows
    const fileBuffer = fs.readFileSync(excelPath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const rawData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    // 4. Nhóm dữ liệu theo mã đề (Trường 'Id' bạn đã đặt khi tạo đề)
    const groupedExams = rawData.reduce((acc: any, row: any) => {
      const examCode = row.Id || "Unknown";
      if (!acc[examCode]) {
        acc[examCode] = {
          examCode: examCode,
          questionsCount: 0,
          questions: [],
        };
      }
      acc[examCode].questions.push(row);
      acc[examCode].questionsCount++;
      return acc;
    }, {});

    return NextResponse.json({
      ...currentConfig,
      exams: Object.values(groupedExams),
    });
  } catch (error: any) {
    console.error("Lỗi API chi tiết:", error);
    return NextResponse.json({ error: "Lỗi hệ thống: " + error.message }, { status: 500 });
  }
}

/**
 * API XÓA BỘ ĐỀ THEO ID
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!fs.existsSync(CONFIG_PATH)) {
      return NextResponse.json({ error: "File cấu hình không tồn tại" }, { status: 404 });
    }

    const configs = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    const itemToDelete = configs.find((c: any) => c.id === id);

    if (!itemToDelete) {
      return NextResponse.json({ error: "Không tìm thấy bộ đề để xóa" }, { status: 404 });
    }

    // 1. Xóa file Excel vật lý
    const excelPath = path.join(EXAMS_DIR, itemToDelete.excelFile);
    if (fs.existsSync(excelPath)) {
      await fsPromise.unlink(excelPath);
    }

    // 2. Cập nhật lại file JSON (Xóa khỏi danh sách)
    const newConfigs = configs.filter((c: any) => c.id !== id);
    await fsPromise.writeFile(CONFIG_PATH, JSON.stringify(newConfigs, null, 2));

    return NextResponse.json({ success: true, message: "Đã xóa bộ đề thành công" });
  } catch (error: any) {
    return NextResponse.json({ error: "Lỗi khi xóa: " + error.message }, { status: 500 });
  }
}
