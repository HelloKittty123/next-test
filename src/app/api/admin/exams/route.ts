import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fsPromise from "fs/promises";
import fs from "fs";
import { existsSync } from "fs";
import * as XLSX from "xlsx";
import { ExamStatus } from "@types";

const CONFIG_PATH = path.join(process.cwd(), "data", "exams-config.json");
const EXAM_DIR = path.join(process.cwd(), "data", "exams");

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
      return NextResponse.json([]);
    }

    const data = fs.readFileSync(configPath, "utf-8");
    const configs = JSON.parse(data);

    // Trình bày danh sách từ mới nhất đến cũ nhất
    const sortedConfigs = configs.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json(sortedConfigs);
  } catch (error: any) {
    return NextResponse.json({ error: "Không thể lấy danh sách bộ đề" }, { status: 500 });
  }
}

// TẠO MỚI BỘ ĐỀ
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const json = formData.get("dto") as string;

    const valueJ = JSON.parse(json);

    const { title, numExams, numQuestions, status, duration = 60, questionPast, symbol, turn } = valueJ;

    if (!file) {
      return NextResponse.json({ error: "File không được để trống." }, { status: 400 });
    }

    if (!title || !numExams || !numQuestions || !duration || !questionPast || !symbol) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    if (
      Number(numExams) <= 0 ||
      Number(numQuestions) <= 0 ||
      Number(duration) <= 0 ||
      Number(questionPast) <= 0 ||
      Number(turn) < 0
    ) {
      return NextResponse.json(
        {
          error: "Số lượng đề, số câu hỏi, số câu trả lời đạt, lần thi và thời gian phải lớn hơn 0",
        },
        { status: 400 },
      );
    }

    let filePath = "";
    const currentTime = new Date();

    const fileExtension = path.extname(file.name); // Lấy đuôi .xlsx, .xls, v.v.
    if (fileExtension !== ".xlsx") {
      return NextResponse.json({ error: "File phải có định dạng .xlsx." }, { status: 400 });
    }

    //Xác định đường dẫn thư mục
    const uploadDir = path.join(process.cwd(), "data", "questionnaire");

    // Kiểm tra và tạo thư mục nếu chưa tồn tại
    try {
      await fsPromise.access(uploadDir);
    } catch {
      await fsPromise.mkdir(uploadDir, { recursive: true });
    }

    //Chuyển đổi file thành Buffer
    const bytes = await file.arrayBuffer();
    const bufferFile = Buffer.from(bytes);
    const newFileName = `${title}-${currentTime.getTime()}${fileExtension}`;
    filePath = path.join(uploadDir, newFileName);

    // Ghi file mới vào hệ thống
    await fsPromise.writeFile(filePath, bufferFile);

    const configs = await readConfig();

    // 1. Đọc Ngân hàng câu hỏi
    if (!fs.existsSync(filePath)) {
      throw new Error("Không tìm thấy file ngân hàng câu hỏi");
    }
    const fileBuffer = fs.readFileSync(filePath);
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
        allExamsData.push({
          Id: `DE_${i}`,
          Code: `${(symbol as string).toUpperCase()}${currentTime.getFullYear()}${turn || ""}${i}`,
          STT: idx + 1,
          ...q,
        });
      });
    }

    // 3. Chuẩn bị ghi file Excel kết quả
    const excelName = `${title}_${numExams}_DE_${numQuestions}_CAU_HOI_${currentTime.getTime()}.xlsx`.replace(
      /\s+/g,
      "_",
    );
    const excelPath = path.join(process.cwd(), "data", "exams", excelName);

    if (!fs.existsSync(EXAM_DIR)) {
      fs.mkdirSync(EXAM_DIR, { recursive: true });
    }

    const newSheet = XLSX.utils.json_to_sheet(allExamsData);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "DeThi");

    // SỬA LỖI GHI FILE: Dùng newWorkbook và ghi bằng fs.writeFileSync
    const buffer = XLSX.write(newWorkbook, {
      type: "buffer",
      bookType: "xlsx",
    });
    fs.writeFileSync(excelPath, buffer);

    // 4. Tạo mới trong JSON
    const newConfig = {
      id: currentTime.getTime().toString(),
      title,
      numExams,
      numQuestions,
      duration,
      questionPast,
      turn,
      symbol,
      fileName: newFileName,
      status: status || ExamStatus.INACTIVE,
      excelFile: excelName,
      createdAt: currentTime.toISOString(),
      updatedAt: currentTime.toISOString(),
    };

    configs.push(newConfig);

    await fsPromise.writeFile(CONFIG_PATH, JSON.stringify(configs, null, 2));

    return NextResponse.json(newConfig);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// CẬP NHẬT TRẠNG THÁI BỘ ĐỀ
export async function PUT(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    // Kiểm tra dữ liệu đầu vào
    if (!id || status === undefined) {
      return NextResponse.json({ error: "Thiếu ID bộ đề hoặc trạng thái mới" }, { status: 400 });
    }

    const configs = await readConfig();
    const existingIndex = configs.findIndex((c: any) => c.id === id);

    if (existingIndex === -1) {
      return NextResponse.json({ error: "Không tìm thấy bộ đề để cập nhật" }, { status: 404 });
    }

    // Cập nhật trạng thái và thời gian chỉnh sửa
    configs[existingIndex] = {
      ...configs[existingIndex],
      status: status,
      updatedAt: new Date().toISOString(),
    };

    // Lưu lại vào file JSON
    await fsPromise.writeFile(CONFIG_PATH, JSON.stringify(configs, null, 2));

    return NextResponse.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      data: configs[existingIndex],
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Lỗi hệ thống: " + error.message }, { status: 500 });
  }
}
