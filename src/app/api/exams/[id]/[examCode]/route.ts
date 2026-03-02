import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string; examCode: string }> }) {
  try {
    // 1. Lấy ID từ URL (Next.js 15 await params)
    const { id, examCode } = await params;

    // 2. Đường dẫn tới file config tổng của bạn
    const configPath = path.join(process.cwd(), "data", "exams-config.json");

    if (!fs.existsSync(configPath)) {
      return NextResponse.json({ error: "Hệ thống chưa có dữ liệu cấu hình." }, { status: 404 });
    }

    // 3. Đọc danh sách bộ đề và tìm bộ đề theo ID
    const configs = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const examConfig = configs.find((item: any) => item.id === id);

    // 4. Kiểm tra sự tồn tại và trạng thái active
    if (!examConfig) {
      return NextResponse.json({ error: "Không tìm thấy bộ đề này." }, { status: 404 });
    }

    if (examConfig.status !== "active") {
      return NextResponse.json(
        {
          error: "Bộ đề này không tồn tại hoặc chưa được kích hoạt.",
        },
        { status: 403 },
      );
    }

    // 5. Xác định đường dẫn file Excel từ trường excelFile trong config
    const excelPath = path.join(process.cwd(), "data", "exams", examConfig.excelFile);
    if (!fs.existsSync(excelPath)) {
      return NextResponse.json({ error: "File dữ liệu bộ đề không tồn tại." }, { status: 404 });
    }

    // 6. Đọc dữ liệu từ file Excel
    const fileBuffer = fs.readFileSync(excelPath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (data.length === 0) {
      return NextResponse.json({ error: "Nội dung bộ đề trống." }, { status: 400 });
    }

    // 7. Lọc câu hỏi theo mã đề đã bốc
    const questions = data.filter((item) => item["Code"] === examCode);
    if (questions.length === 0) {
      return NextResponse.json({ error: "Mã đề không tồn tại." }, { status: 400 });
    }

    // 8. Trả về thông tin đầy đủ cho thí sinh (không kèm đáp án)
    return NextResponse.json({
      id: examConfig.id,
      title: examConfig.title,
      duration: examConfig.duration, // Lấy từ file config của bạn
      totalQuestions: examConfig.numQuestions, // Lấy từ file config của bạn
      examCode,
      questions: questions.map((q) => ({
        Question: q["Question"],
        STT: q["STT"],
        A: q["A"],
        B: q["B"],
        C: q["C"],
        D: q["D"],
      })),
    });
  } catch (error: any) {
    console.error("Lỗi lấy đề:", error);
    return NextResponse.json({ error: "Lỗi hệ thống: " + error.message }, { status: 500 });
  }
}
