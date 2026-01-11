"use client";

import { Button } from "@components";
import { Dialog } from "@radix-ui/themes";
import { getExamByIdAPI } from "@services";
import { Exam, ExamDetail } from "@types";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ExamItem from "./ExemItem";
import ExamItemDetail from "./ExamItemDetail";

export interface IExamDetailProps {
    exam: Exam;
}

function ExamDetailDialog({ exam }: IExamDetailProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setIsLoading] = useState(true);
    const [examDetail, setExamDetail] = useState<Exam | undefined>();
    const [selectedExam, setSelectedExam] = useState<ExamDetail | undefined>();

    useEffect(() => {
        if (isOpen) {
            getExam();
        }
    }, [isOpen]);

    const getExam = async () => {
        try {
            const examDetail = await getExamByIdAPI(exam.id);
            if (examDetail) {
                setExamDetail(examDetail);
                setIsLoading(false);
                return;
            }
        } catch (e) {
            toast.error("Lấy dữ liệu đề kiểm tra thất bại");
        }
        setIsOpen(false);
    };

    console.log(selectedExam);

    const renderExam = () => {
        return (
            <>
                <div className="grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
                    {/* Cột 1: Danh sách đề */}
                    <ExamItem
                        exam={examDetail!}
                        selectedExam={selectedExam}
                        setSelectedExam={setSelectedExam}
                    />

                    {/* Cột 2: Chi tiết câu hỏi */}
                    <ExamItemDetail
                        exam={examDetail}
                        selectedExam={selectedExam}
                    />
                </div>
            </>
        );
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger>
                <Button tooltip="Xem chi tiết" variant="basic">
                    <Eye className="h-4 w-4" />
                </Button>
            </Dialog.Trigger>
            <Dialog.Content maxWidth="80%" width="1000px">
                <Dialog.Title>Thông tin bộ đề {exam.title}</Dialog.Title>
                {loading ? (
                    <div className="flex items-center justify-center"></div>
                ) : (
                    renderExam()
                )}
            </Dialog.Content>
        </Dialog.Root>
    );
}

export default ExamDetailDialog;
