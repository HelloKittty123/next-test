"use client";

import { getQuestionAPI } from "@services";
import { Exam, Question } from "@types";
import { fetchData } from "@utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AdminHome() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [activeExam, setActiveExam] = useState<string>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getQuestion();
        getExam();
    }, []);

    const getQuestion = async () => {
        try {
            const questions = await getQuestionAPI();

            setQuestions(questions || []);
        } catch (e) {
            toast("Lấy thông tin danh sách câu hỏi thất bại", {
                type: "error",
                autoClose: 3000,
                position: "top-right",
            });
        }
    };

    const getExam = async () => {
        // try {
        //     const exams = await getExamAPI();
        //     setExams(exams || []);
        // } catch (e) {
        //     toast("Lấy thông tin danh sách bài kiểm tra thất bại", {
        //         type: "error",
        //         autoClose: 3000,
        //         position: "top-right",
        //     });
        // }
    };

    const getActiveExam = async () => {
        try {
            const exams = await fetchData<Exam[]>({
                api: "/api/admin/exams",
                method: "GET",
            });

            setExams(exams || []);
        } catch (e) {
            toast("Lấy thông tin bộ đề đang được sử dụng thất bại", {
                type: "error",
                autoClose: 3000,
                position: "top-right",
            });
        }
    };

    return (
        <div className="flex flex-col w-full h-full ">
            <div
                style={{ wordWrap: "break-word" }}
                className="flex items-center md:px-4 md:py-6 px-2 py-3 bg-[var(--primary-primary-background)] rounded-b-[12px] md:min-h-[150px] min-h-[60px]"
            >
                <div className="md:text-2xl text-base font-semibold text-[var(--primary-primary)]">
                    Chào mừng bạn đến với trang quản trị!
                </div>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
                <div
                    className="grid px-6 py-8 min-h-0"
                    style={{
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(300px, 1fr))",
                        gridGap: "40px",
                    }}
                >
                    <div className="flex px-4 py-6 md:text-lg text-base text-[var(--info-color-info)] font-medium bg-[var(--info-color-info-background)] rounded-lg h-[200px] cursor-pointer">
                        {questions.length} câu hỏi đang có trong dữ liệu hệ
                        thống
                    </div>
                    <div className="flex px-4 py-6 md:text-lg text-base text-[var(--info-color-info)] font-medium bg-[var(--info-color-info-background)] rounded-lg h-[200px] cursor-pointer">
                        {exams.length} bộ đề đã được tạo
                    </div>
                    <div className="flex px-4 py-6 md:text-lg text-base text-[var(--info-color-info)] font-medium bg-[var(--info-color-info-background)] rounded-lg h-[200px] cursor-pointer">
                        {activeExam
                            ? `Bộ đề ${activeExam} đang được sử dụng`
                            : "Không có bộ đề nào đang được sử dụng"}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminHome;
