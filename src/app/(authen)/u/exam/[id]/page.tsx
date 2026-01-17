"use client";

import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    TextCustom,
} from "@components";
import { useAuth, useLoading } from "@hooks";
import { Callout } from "@radix-ui/themes";
import { getExamTestAPI } from "@services";
import { ExamResult, ExamTest } from "@types";
import { formatDate } from "@utils";
import {
    AlertCircle,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    Info,
    User,
} from "lucide-react";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ExamView from "./ExamView";
import ResultExam from "./ResultExam";

const instructions = [
    "Đọc kỹ đề bài trước khi trả lời",
    "Mỗi câu hỏi chỉ có một đáp án đúng",
    "Không được sử dụng tài liệu trong khi làm bài",
    "Bài thi sẽ tự động nộp khi hết thời gian",
    "Không được thoát khỏi trang thi trong quá trình làm bài",
];

function Exam() {
    const [examTest, setExamTest] = useState<ExamTest | null | undefined>();
    const [agreed, setAgreed] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const [result, setResult] = useState<ExamResult>();

    const { account } = useAuth();

    const { setLoading } = useLoading();

    const params = useParams();
    const { id } = params;

    useEffect(() => {
        try {
            const start = localStorage.getItem("start");
            const result = localStorage.getItem("result");
            const exam = localStorage.getItem("exam");
            const isStart = start === "true";
            setIsStart(isStart);
            if (result) {
                setResult(JSON.parse(result));
            }

            if (exam) {
                setExamTest(JSON.parse(exam));
            } else {
                getExamTest();
            }
        } catch (e) {
            console.log(e);
        }
    }, [id]);

    const getExamTest = async () => {
        try {
            setLoading(true);
            const examTest = await getExamTestAPI(id!.toString());
            setExamTest({ ...examTest!, date: new Date() });
            localStorage.setItem("exam", JSON.stringify(examTest));
        } catch (e) {
            console.log(e);
            toast.error("Lấy đề kiểm tra thất bại");
        }
        setLoading(false);
    };

    const handleStart = () => {
        setIsStart(true);
        localStorage.setItem("start", "true");
    };

    if (result && examTest) {
        return <ResultExam result={result} exam={examTest} />;
    }

    return (
        <>
            {examTest &&
                (isStart ? (
                    <ExamView exam={examTest} setResult={setResult} />
                ) : (
                    <div className="w-full h-full overflow-auto bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
                        <div className="max-w-5xl mx-auto">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                    <FileText className="h-8 w-8 text-blue-600" />
                                </div>
                                <h1 className="text-3xl mb-2 font-semibold">
                                    Thông tin bài kiểm tra
                                </h1>
                                <p className="text-gray-600 text-sm font-normal">
                                    Vui lòng đọc kỹ thông tin và điền đầy đủ
                                    trước khi bắt đầu
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Thông tin bài thi */}
                                <div className="md:col-span-2 space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <BookOpen className="h-5 w-5 text-blue-600 font-medium" />
                                                Thông tin đề thi
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <h3 className="text-xl mb-1 font-medium">
                                                {examTest.title}
                                            </h3>

                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                                                        <Clock className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Thời gian
                                                        </p>
                                                        <p className="font-semibold">
                                                            {examTest.duration}{" "}
                                                            phút
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                                                        <FileText className="h-5 w-5 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Số câu hỏi
                                                        </p>
                                                        <p className="font-semibold">
                                                            {
                                                                examTest.totalQuestions
                                                            }{" "}
                                                            câu
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Điểm tối đa
                                                        </p>
                                                        <p className="font-semibold">
                                                            10
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                                                    <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
                                                        <Calendar className="h-5 w-5 text-orange-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Ngày thi
                                                        </p>
                                                        <p className="font-semibold">
                                                            {formatDate(
                                                                examTest.date.toISOString(),
                                                                "DD/MM/YYYY",
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t">
                                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                    <Info className="h-4 w-4 text-blue-600" />
                                                    Hướng dẫn làm bài
                                                </h4>
                                                <ul className="space-y-2">
                                                    {instructions.map(
                                                        (
                                                            instruction,
                                                            index,
                                                        ) => (
                                                            <li
                                                                key={index}
                                                                className="flex items-start gap-2 text-sm text-gray-700"
                                                            >
                                                                <span className="flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex-shrink-0 mt-0.5">
                                                                    {index + 1}
                                                                </span>
                                                                {instruction}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Callout.Root color="red">
                                        <Callout.Icon>
                                            <AlertCircle />
                                        </Callout.Icon>
                                        <Callout.Text>
                                            <strong>Lưu ý quan trọng:</strong>{" "}
                                            Sau khi bắt đầu làm bài, đồng hồ đếm
                                            ngược sẽ bắt đầu chạy. Bài thi sẽ tự
                                            động nộp khi hết thời gian hoặc khi
                                            bạn nhấn nút "Nộp bài".
                                        </Callout.Text>
                                    </Callout.Root>
                                </div>

                                {/* Form thông tin thí sinh */}
                                <div className="md:col-span-1">
                                    <Card className="sticky top-6">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <User className="h-5 w-5 text-blue-600 font-medium" />
                                                Thông tin thí sinh
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <TextCustom
                                                text={`Họ và tên: ${account?.name}`}
                                            />

                                            <TextCustom
                                                text={`Email: ${account?.email}`}
                                            />

                                            <div className="pt-4 border-t space-y-4">
                                                <div className="flex items-start gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="agreement"
                                                        checked={agreed}
                                                        onChange={(e) =>
                                                            setAgreed(
                                                                e.target
                                                                    .checked,
                                                            )
                                                        }
                                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <label
                                                        htmlFor="agreement"
                                                        className="text-sm text-gray-700 cursor-pointer"
                                                    >
                                                        Tôi đã đọc và hiểu rõ
                                                        các quy định về bài kiểm
                                                        tra. Tôi cam kết làm bài
                                                        trung thực và tuân thủ
                                                        các quy tắc.
                                                    </label>
                                                </div>

                                                <Button
                                                    onClick={handleStart}
                                                    disabled={!agreed}
                                                    size="base"
                                                    className="w-full"
                                                >
                                                    Bắt đầu làm bài
                                                </Button>
                                            </div>

                                            <div className="pt-4 border-t">
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-xs text-gray-600 mb-2">
                                                        Thông tin bài thi:
                                                    </p>
                                                    <div className="space-y-1 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">
                                                                Mã đề:
                                                            </span>
                                                            <span className="font-mono font-semibold">
                                                                {
                                                                    examTest.examCode
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
        </>
    );
}

export default Exam;
