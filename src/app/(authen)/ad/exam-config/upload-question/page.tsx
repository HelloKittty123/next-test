"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components";
import { useExamConfig } from "@hooks";
import { Question } from "@types";
import { ArrowLeft, Check, FileSpreadsheet, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

export default function QuestionUpload() {
  const [isUploaded, setIsUploaded] = useState(false);

  const { questions, setQuestions, file, setFile } = useExamConfig();

  const router = useRouter();

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

        const parsedQuestions: Question[] = jsonData.map((row: any) => ({
          Question: row["Question"] || "",
          A: row["A"] || "",
          B: row["B"] || "",
          C: row["C"] || "",
          D: row["D"] || "",
          Answer: row["Answer"] || "",
        }));

        setQuestions(parsedQuestions);
        setIsUploaded(true);
        toast.success(`Đã tải lên ${parsedQuestions.length} câu hỏi thành công!`);
      } catch (error) {
        toast.error("Lỗi khi đọc file Excel. Vui lòng kiểm tra định dạng file.");
        console.error("Error reading Excel file:", error);
      }
    };

    reader.readAsBinaryString(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
  });

  const handleReset = () => {
    setQuestions([]);
    setIsUploaded(false);
  };

  const downloadTemplate = () => {
    const template = [
      {
        Question: "React là gì?",
        A: "Một thư viện JavaScript",
        B: "Một ngôn ngữ lập trình",
        C: "Một hệ điều hành",
        D: "Một cơ sở dữ liệu",
        Answer: "A",
      },
      {
        Question: "JSX là viết tắt của gì?",
        A: "JavaScript XML",
        B: "Java Syntax Extension",
        C: "JSON XML",
        D: "JavaScript Extension",
        Answer: "A",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Questions");
    XLSX.writeFile(wb, "template_cau_hoi.xlsx");
  };

  return (
    <div className="h-full w-full bg-gray-50 p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="basic" tooltip="Quay lại" onClick={() => router.push("/ad/exam-config")}>
          <ArrowLeft />
        </Button>
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold text-[var(--typography-light-theme-title)]">Tải câu hỏi</div>
          <div className="text-base font-normal text-[var(--typography-light-theme-subtitle)]">
            Tải lên file Excel chứa danh sách câu hỏi
          </div>
        </div>
      </div>

      {!isUploaded ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Tải lên file Excel</CardTitle>
            <CardDescription style={{ fontSize: "12px" }}>
              Hỗ trợ định dạng .xlsx. File cần có các cột: Question, A, B, C, D, Answer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                  ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-blue-50 rounded-full">
                  {isDragActive ? (
                    <Upload className="h-12 w-12 text-blue-500" />
                  ) : (
                    <FileSpreadsheet className="h-12 w-12 text-blue-500" />
                  )}
                </div>
                {isDragActive ? (
                  <p className="text-lg">Thả file vào đây...</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Kéo thả file Excel vào đây hoặc click để chọn file</p>
                    <p className="text-xs text-gray-500">Chỉ hỗ trợ file .xlsx</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <Button size="sm" onClick={downloadTemplate} classChildrens="flex items-center text-sm">
                <FileSpreadsheet className="h-4 w-4" />
                Tải tài liệu mẫu
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-auto" style={{ maxHeight: "calc(100% - 84px)" }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Danh sách câu hỏi đã tải lên</CardTitle>
                <CardDescription style={{ fontSize: "12px" }}>
                  Tổng số: {questions?.length || 0} câu hỏi
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReset} classChildrens="flex items-center text-sm">
                  <X className="h-4 w-4" />
                  Hủy
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push(`/ad/exam-config/add`)}
                  className="bg-green-600 hover:bg-green-700"
                  classChildrens="flex items-center text-sm"
                >
                  <Check className="h-4 w-4" />
                  Xác nhận
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <div className="border rounded-lg overflow-auto h-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 sticky top-0">STT</TableHead>
                    <TableHead className="min-w-[300px] sticky top-0">Câu hỏi</TableHead>
                    <TableHead className="sticky top-0">Đáp án A</TableHead>
                    <TableHead className="sticky top-0">Đáp án B</TableHead>
                    <TableHead className="sticky top-0">Đáp án C</TableHead>
                    <TableHead className="sticky top-0">Đáp án D</TableHead>
                    <TableHead className="sticky top-0">Đáp án đúng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(questions || []).map((q, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="md:w-[500px] w-[250px]">{q.Question}</TableCell>
                      <TableCell className="md:w-[30px] w-[200px]">{q.A}</TableCell>
                      <TableCell className="md:w-[30px] w-[200px]">{q.B}</TableCell>
                      <TableCell className="md:w-[30px] w-[200px]">{q.C}</TableCell>
                      <TableCell className="md:w-[30px] w-[200px]">{q.D}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">{q.Answer}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
