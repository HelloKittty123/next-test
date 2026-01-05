import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fsPromise from "fs/promises";
import fs from "fs";
import { existsSync } from "fs";
import * as XLSX from "xlsx";

const CONFIG_PATH = path.join(process.cwd(), "data", "exams-config.json");
const EXAM_DIR = path.join(process.cwd(), "data", "exams");
const QUESTION_BANK_PATH = path.join(process.cwd(), "data", "questionnaire", "questions.xlsx");

// Helper: Đọc file config JSON
async function readConfig() {
  if (!existsSync(CONFIG_PATH)) return [];
  const data = await fsPromise.readFile(CONFIG_PATH, "utf-8");
  return JSON.parse(data);
}

export async function GET() {
  try {
    const configPath = path.join(process.cwd(), "data", "exams-config.json");

    if (!fs.existsSync(configPath)) {
      return NextResponse.json({ success: true, data: [] });
    }

    const data = fs.readFileSync(configPath, "utf-8");
    const configs = JSON.parse(data);

    // Trình bày danh sách từ mới nhất đến cũ nhất
    const sortedConfigs = configs.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(sortedConfigs);
  } catch (error: any) {
    return NextResponse.json({ error: "Không thể lấy danh sách bộ đề" }, { status: 500 });
  }
}

// TẠO MỚI VÀ CẬP NHAT BỘ ĐỀ
export async function POST(req: NextRequest) {
  try {
    const { id, title, numExams, numQuestions, duration = 60 } = await req.json();

    if (!title || !numExams || !numQuestions || !duration) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    if (Number(numExams) <= 0 || Number(numQuestions) <= 0 || Number(duration) <= 0) {
      return NextResponse.json({ error: "Số lượng đề, số câu hỏi và thời gian phải lớn hơn 0" }, { status: 400 });
    }

    const configs = await readConfig();

    // 1. Đọc Ngân hàng câu hỏi
    if (!fs.existsSync(QUESTION_BANK_PATH)) {
      throw new Error("Không tìm thấy file ngân hàng câu hỏi");
    }
    const fileBuffer = fs.readFileSync(QUESTION_BANK_PATH);
    const bankWorkbook = XLSX.read(fileBuffer, { type: "buffer" });
    const questions: any[] = XLSX.utils.sheet_to_json(bankWorkbook.Sheets[bankWorkbook.SheetNames[0]]);

    if (questions.length < numQuestions) {
      return NextResponse.json({ error: "Ngân hàng không đủ câu hỏi" }, { status: 400 });
    }

    // 2. Logic Trộn đề
    const allExamsData: any[] = [];
    for (let i = 1; i <= numExams; i++) {
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, numQuestions);
      selected.forEach((q, idx) => {
        allExamsData.push({ Id: `DE_${i}`, STT: idx + 1, ...q });
      });
    }

    // 3. Chuẩn bị ghi file Excel kết quả
    const excelName = `${title}_${numExams}_DE_${numQuestions}_CAU_HOI_${Date.now()}.xlsx`.replace(/\s+/g, "_");
    const excelPath = path.join(process.cwd(), "data", "exams", excelName);

    if (!fs.existsSync(EXAM_DIR)) {
      fs.mkdirSync(EXAM_DIR, { recursive: true });
    }

    const newSheet = XLSX.utils.json_to_sheet(allExamsData);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "DeThi");

    // SỬA LỖI GHI FILE: Dùng newWorkbook và ghi bằng fs.writeFileSync
    const buffer = XLSX.write(newWorkbook, { type: "buffer", bookType: "xlsx" });
    fs.writeFileSync(excelPath, buffer);

    // 4. Kiểm tra Cập nhật hay Tạo mới trong JSON
    const existingIndex = configs.findIndex((c: any) => c.id === id);
    const newConfig = {
      id: id || Date.now().toString(),
      title,
      numExams,
      numQuestions,
      duration,
      excelFile: excelName,
      createdAt: existingIndex !== -1 ? configs[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex !== -1) {
      // Xóa file excel cũ nếu đang cập nhật
      const oldFilePath = path.join(EXAM_DIR, configs[existingIndex].excelFile);
      if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      configs[existingIndex] = newConfig;
    } else {
      configs.push(newConfig);
    }

    await fsPromise.writeFile(CONFIG_PATH, JSON.stringify(configs, null, 2));

    return NextResponse.json(newConfig);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
