import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";
import { Exam } from "@types";

export async function POST(req: NextRequest) {
  try {
    /**
     * examId: Id của bộ đề
     * examCode: Mã đề
     * answers: câu trả lời dưới dạng object
     * VD: answers = {
     *  1: "A",
     *  2: "B"
     * }
     */
    const { examId, examCode, answers } = await req.json();

    if (!examCode || !answers) {
      return NextResponse.json({ error: "Thiếu dữ liệu nộp bài." }, { status: 400 });
    }

    // 1. Xác định file đang được áp dụng
    const configPath = path.join(process.cwd(), "data", "exams-config.json");
    console.log('configPath:', configPath);
    
    if (!fs.existsSync(configPath)) {
      return NextResponse.json({ error: "Không tìm thấy bộ đề hiện tại." }, { status: 404 });
    }
    const config: Exam[] = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const activeFileName = config.find((c) => c.id === examId && c.status === "active");
    if (!activeFileName) {
      return NextResponse.json({ error: "Bộ đề không tồn tại" }, { status: 400 });
    }
    // 2. Đọc file Excel để lấy đáp án gốc
    const excelPath = path.join(process.cwd(), "data", "exams", activeFileName.excelFile);
    const fileBuffer = fs.readFileSync(excelPath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    // 3. Lọc ra các câu hỏi của mã đề này để đối chiếu
    const originalExam = data.filter((item) => item["Id"] === examCode);

    // 4. Chấm điểm
    let correctCount = 0;
    const details = originalExam.map((q) => {
      const qNum = q["STT"];
      const correctAnswer = q["Answer"];

      // Tìm câu trả lời của thí sinh cho câu hỏi này
      const userAns = answers["qNum"];
      const isCorrect = userAns === correctAnswer;

      if (isCorrect) correctCount++;

      return {
        questionNumber: qNum,
        userSelected: userAns || null,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
      };
    });

    // 5. Tính toán kết quả cuối cùng
    const totalQuestions = originalExam.length;
    const score = ((correctCount / totalQuestions) * 10).toFixed(2); // Thang điểm 10

    return NextResponse.json({
      score: score,
      correctCount: correctCount,
      totalQuestions: totalQuestions,
      percentage: ((correctCount / totalQuestions) * 100).toFixed(0) + "%",
      details: details, // Trả về chi tiết từng câu để xem lại (tùy chọn)
    });
  } catch (error) {
    console.error("Lỗi chấm điểm:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi chấm điểm." }, { status: 500 });
  }
}
