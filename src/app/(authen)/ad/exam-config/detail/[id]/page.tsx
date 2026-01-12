"use client";

import { getExamByIdAPI } from "@services";
import { Exam, ExamDetail } from "@types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ExamItemDetail from "./ExamItemDetail";
import ExamItem from "./ExemItem";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@components";

function ExamConfigDetail() {
  const [loading, setLoading] = useState(true);
  const [examDetail, setExamDetail] = useState<Exam | undefined>();
  const [selectedExam, setSelectedExam] = useState<ExamDetail | undefined>();

  const params = useParams();
  const { id } = params;

  const router = useRouter();

  useEffect(() => {
    getExam();
  }, []);

  const getExam = async () => {
    try {
      const examDetail = await getExamByIdAPI(id!.toString());
      if (examDetail) {
        setExamDetail(examDetail);
        setLoading(false);
        return;
      }
    } catch (e) {
      toast.error("Lấy dữ liệu đề kiểm tra thất bại");
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full w-full p-6 bg-gray-50">
      <div className="flex items-center gap-2">
        <Button variant="basic" tooltip="Quay lại" onClick={() => router.push("/ad/exam-config")}>
          <ArrowLeft />
        </Button>
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold text-[var(--typography-light-theme-title)]">
            Chi tiết bộ đề và câu hỏi {examDetail?.title}
          </div>
          <div className="text-base font-normal text-[var(--typography-light-theme-subtitle)]">
            Xem chi tiết các đề và câu hỏi trong từng đề
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 grid-rows-[100%]">
        {/* Cột 1: Danh sách đề */}
        <ExamItem exam={examDetail!} selectedExam={selectedExam} setSelectedExam={setSelectedExam} />

        {/* Cột 2: Chi tiết câu hỏi */}
        <ExamItemDetail exam={examDetail} selectedExam={selectedExam} />
      </div>
    </div>
  );
}

export default ExamConfigDetail;
