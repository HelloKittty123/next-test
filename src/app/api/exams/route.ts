import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    // 1. Xác định bộ đề đang được áp dụng từ file cấu hình
    const configPath = path.join(process.cwd(), "data", "active-exam.json");

    if (!fs.existsSync(configPath)) {
      return NextResponse.json({ error: "Hệ thống chưa áp dụng bộ đề nào." }, { status: 404 });
    }

    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const activeFileName = config.activeExam;

    // 2. Kiểm tra file Excel bộ đề có tồn tại không
    const excelPath = path.join(process.cwd(), "data", "exams", activeFileName);
    if (!fs.existsSync(excelPath)) {
      return NextResponse.json({ error: "File bộ đề gốc không tồn tại hoặc đã bị xóa." }, { status: 404 });
    }

    // 3. Đọc dữ liệu từ file Excel
    const fileBuffer = fs.readFileSync(excelPath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (data.length === 0) {
      return NextResponse.json({ error: "Bộ đề trống." }, { status: 400 });
    }

    // 4. Lấy danh sách các Mã Đề duy nhất có trong file
    // Giả sử cột mã đề tên là "Mã Đề" như các API trước đã tạo
    const uniqueExamCodes = Array.from(new Set(data.map((item) => item["Id"])));

    // 5. Chọn ngẫu nhiên 1 Mã Đề
    const randomCode = uniqueExamCodes[Math.floor(Math.random() * uniqueExamCodes.length)];

    // 6. Lọc lấy tất cả câu hỏi thuộc về Mã Đề đã chọn
    const questions = data.filter((item) => item["Id"] === randomCode);

    return NextResponse.json({
      examCode: randomCode,
      totalQuestions: questions.length,
      appliedFile: activeFileName,
      questions: questions.map((q) => ({
        questionNumber: q["Index"],
        content: q["Question"],
        options: {
          A: q["A"],
          B: q["B"],
          C: q["C"],
          D: q["D"],
        },
        // Không trả về đáp án đúng nếu đây là API cho thí sinh làm bài
        // answer: q["Đáp án đúng"] || q["Answer"]
      })),
    });
  } catch (error) {
    console.error("Lỗi lấy đề ngẫu nhiên:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi lấy đề thi." }, { status: 500 });
  }
}
