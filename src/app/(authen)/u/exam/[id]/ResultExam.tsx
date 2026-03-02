"use client";

import { Button } from "@components";
import { useAuth } from "@hooks";
import { ExamResult, ExamTest } from "@types";
import { formatDate } from "@utils";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export interface ResultExamProps {
  result: ExamResult;
  exam: ExamTest;
}

function ResultExam({ result, exam }: ResultExamProps) {
  const { account } = useAuth();

  const componentRef = useRef<HTMLDivElement>(null);

  // Hàm xử lý in PDF
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Phieu_Ket_Qua_Sat_Hach",
  });

  return (
    <div className="p-8 bg-gray-100 h-full w-full flex flex-col items-center gap-2 overflow-auto">
      {/* Nút bấm điều khiển - Không in vào PDF */}
      <Button style={{ flexShrink: 0 }} onClick={handlePrint}>
        Xuất file PDF / In Phiếu
      </Button>
      {/** Vùng nội dung hiển thị */}
      <div
        className="bg-white w-[1000px] max-w-[90%] min-h-[297mm] p-[15mm] shadow-lg text-black font-serif leading-relaxed"
        style={{ fontFamily: '"Times New Roman", Times, serif' }}
      >
        {/* Header Section [cite: 1] */}
        <div className="flex justify-between items-start text-center mb-8">
          <div className="w-[45%]">
            <h2 className="font-bold text-[13pt] uppercase">Bộ Nông nghiệp và Môi trường</h2>
            <h2 className="font-bold text-[13pt] uppercase leading-tight">Công ty TNHH MTV KTCTTL Bắc Nam Hà</h2>
            <div className="mt-1 border-t border-black w-24 mx-auto"></div>
          </div>
          <div className="w-[50%]">
            <h2 className="font-bold text-[13pt] uppercase">Cộng hòa Xã hội Chủ nghĩa Việt Nam</h2>
            <h2 className="font-bold text-[13pt]">Độc lập – Tự do – Hạnh phúc</h2>
            <div className="mt-1 border-t border-black w-32 mx-auto"></div>
          </div>
        </div>

        {/* Title Section [cite: 2, 3] */}
        <div className="text-center mb-10">
          <h1 className="font-bold text-[16pt] uppercase mb-2">
            Phiếu kết quả {exam.title}
            {new Date().getFullYear()}
          </h1>
          <p className="italic text-[16px]">MÃ ĐỀ: {exam.examCode}</p>
        </div>

        {/* Info Section  */}
        <div className="space-y-4 text-[13pt]">
          <div className="flex justify-between">
            <div className="w-[48%] flex items-end">
              <span>Tài khoản: {account?.email}</span>
            </div>
            <div className="w-[48%] flex items-end">
              <span>CMND/CCCD: {account?.identity}</span>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="w-[48%] flex items-end">
              <span>Họ và tên: {account?.name}</span>
            </div>
            <div className="w-[48%] flex items-end">
              <span>Ngày sinh: {formatDate(account!.dob!, "DD/MM/YYYY")}</span>
            </div>
          </div>

          <div className="flex items-end">
            <span>Mã đơn vị: {account?.org}</span>
          </div>

          <div className="flex items-end">
            <span>Ngày thi: {formatDate(new Date().toISOString(), "DD/MM/YYYY")}</span>
          </div>
        </div>

        {/* Result Section  */}
        <div className="mt-10 font-bold text-[13pt] space-y-3">
          <p>Điểm thi: {result.score}/10 </p>
          <p>Kết quả: {result.correctCount >= exam.questionPast ? "Đạt" : "Không đạt"} </p>
        </div>
      </div>
      {/* Vùng nội dung in */}
      <div className="hidden">
        <div
          ref={componentRef}
          className=" bg-white w-full h-full p-[15mm] shadow-lg text-black font-serif leading-relaxed"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          {/* Header Section [cite: 1] */}
          <div className="flex justify-between items-start text-center mb-8">
            <div className="w-[45%]">
              <h2 className="font-bold text-[13pt] uppercase">Bộ Nông nghiệp và Môi trường</h2>
              <h2 className="font-bold text-[13pt] uppercase leading-tight">Công ty TNHH MTV KTCTTL Bắc Nam Hà</h2>
              <div className="mt-1 border-t border-black w-24 mx-auto"></div>
            </div>
            <div className="w-[50%]">
              <h2 className="font-bold text-[13pt] uppercase">Cộng hòa Xã hội Chủ nghĩa Việt Nam</h2>
              <h2 className="font-bold text-[13pt]">Độc lập – Tự do – Hạnh phúc</h2>
              <div className="mt-1 border-t border-black w-32 mx-auto"></div>
            </div>
          </div>

          {/* Title Section [cite: 2, 3] */}
          <div className="text-center mb-10">
            <h1 className="font-bold text-[16pt] uppercase mb-2">Phiếu kết quả {exam.title}</h1>
            <p className="italic text-[16px]">MÃ ĐỀ: {exam.examCode}</p>
          </div>

          {/* Info Section  */}
          <div className="space-y-4 text-[13pt]">
            <div className="flex justify-between">
              <div className="w-[48%] flex items-end">
                <span>Tài khoản: {account?.email}</span>
              </div>
              <div className="w-[48%] flex items-end">
                <span>CMND/CCCD: {account?.identity}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="w-[48%] flex items-end">
                <span>Họ và tên: {account?.name}</span>
              </div>
              <div className="w-[48%] flex items-end">
                <span>Ngày sinh: {formatDate(account!.dob!, "DD/MM/YYYY")}</span>
              </div>
            </div>

            <div className="flex items-end">
              <span>Mã đơn vị: {account?.org}</span>
            </div>

            <div className="flex items-end">
              <span>Ngày thi: {formatDate(new Date().toISOString(), "DD/MM/YYYY")}</span>
            </div>
          </div>

          {/* Result Section  */}
          <div className="mt-10 font-bold text-[13pt] space-y-3">
            <p>Điểm thi: {result.score}/10 </p>
            <p>Kết quả: {result.correctCount >= exam.questionPast ? "Đạt" : "Không đạt"}</p>
          </div>

          {/* Signature Section  */}
          <div className="mt-16 grid grid-cols-2 text-center gap-10">
            <div>
              <p className="font-bold uppercase mb-1">Cán bộ coi</p>
              <p className="italic text-sm">(Ký, ghi rõ họ tên)</p>
            </div>
            <div>
              <p className="font-bold uppercase mb-1">Thí sinh</p>
              <p className="italic text-sm">(Ký, ghi rõ họ tên)</p>
              <p className="mt-4">{account?.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultExam;
