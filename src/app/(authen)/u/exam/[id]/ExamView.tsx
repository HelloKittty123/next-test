"use client";

import { Button, Card, CardContent, CardHeader, TextCustom } from "@components";
import { useAuth } from "@hooks";
import { Progress, RadioGroup } from "@radix-ui/themes";
import { submitExamAPI } from "@services";
import { ExamResult, ExamTest, Question } from "@types";
import clsx from "clsx";
import { Clock, Mail, User } from "lucide-react";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { toast } from "react-toastify";
import ButtonSubmitExam from "./ButtonSubmitExam";

interface IExamView {
    exam: ExamTest;
    setResult: Dispatch<SetStateAction<ExamResult | undefined>>;
}

function ExamView({ exam, setResult }: IExamView) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60); // 60 phút
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const { account } = useAuth();

    useEffect(() => {
        try {
            const answers = localStorage.getItem("answers");
            const time = localStorage.getItem("time");
            const currentQuestionIndex = localStorage.getItem(
                "currentQuestionIndex",
            );
            if (answers) {
                setAnswers(JSON.parse(answers));
            }

            if (currentQuestionIndex) {
                setCurrentQuestionIndex(+currentQuestionIndex);
            }

            if (time) {
                setTimeRemaining(+time);
            }
        } catch (e) {
            console.log(e);
        }
    }, []);

    useEffect(() => {
        if (!isSubmitted && timeRemaining > 0) {
            localStorage.setItem("time", (timeRemaining - 1).toString());
            const timer = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeRemaining, isSubmitted]);

    useEffect(() => {
        localStorage.setItem("answers", JSON.stringify(answers));
        localStorage.setItem(
            "currentQuestionIndex",
            currentQuestionIndex.toString(),
        );
    }, [answers, currentQuestionIndex]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleSubmit = useCallback(async () => {
        try {
            setIsSubmitted(true);
            const response = await submitExamAPI({
                examId: exam.id,
                examCode: exam.examCode,
                answers: answers,
            });
            setResult(response!);
            localStorage.setItem("result", JSON.stringify(response));
            toast.success("Nộp bài kiểm tra thành công");
        } catch (e) {
            console.log(e);
            toast.error("Nộp bài kiểm tra thất bại");
            setIsSubmitted(false);
        }
    }, [answers, exam]);

    const handleAnswerSelect = (questionNumber: number, selected: string) => {
        setAnswers((prev) => ({ ...prev, [questionNumber]: selected }));
    };

    const currentQuestion = exam.questions[currentQuestionIndex];
    const progress = useMemo(
        () => ((currentQuestionIndex + 1) / exam.totalQuestions) * 100,
        [currentQuestionIndex, exam.totalQuestions],
    );

    return (
        <div className="w-full h-full overflow-auto bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto space-y-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-xl font-semibold">
                                {exam.title} (Đề{" "}
                                {exam.examCode.split("_").pop()})
                            </h2>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4 flx-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                                            {account?.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap">
                                            {account?.email}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className={`flex items-center gap-2 ${timeRemaining < 300 ? "text-red-600" : ""}`}
                                >
                                    <Clock className="h-5 w-5" />
                                    <span className="text-xl font-mono">
                                        {formatTime(timeRemaining)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600 text-base font-medium">
                                <span>
                                    Câu {currentQuestionIndex + 1}/
                                    {exam.totalQuestions}
                                </span>
                                <span>{progress.toFixed(0)}%</span>
                            </div>
                            <Progress value={progress} />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="text-xl mb-4">
                                {currentQuestion.Question}
                            </h3>
                            <RadioGroup.Root
                                value={answers[currentQuestion.STT!] || ""}
                                onValueChange={(e) =>
                                    handleAnswerSelect(currentQuestion.STT!, e)
                                }
                            >
                                <div className="space-y-3">
                                    {["A", "B", "C", "D"].map(
                                        (option, index) => (
                                            <div
                                                onClick={() =>
                                                    handleAnswerSelect(
                                                        currentQuestion.STT!,
                                                        option,
                                                    )
                                                }
                                                key={index}
                                                className={clsx(
                                                    "flex items-center space-x-2 gap-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer",
                                                    option ===
                                                        answers[
                                                            currentQuestion.STT!
                                                        ] &&
                                                        "bg-green-50 border-green-500!",
                                                )}
                                            >
                                                <RadioGroup.Item
                                                    value={option}
                                                    id={`option-${index}`}
                                                />
                                                <TextCustom
                                                    className="flex-1 cursor-pointer"
                                                    text={`${option}. ${currentQuestion[option as keyof Question]}`}
                                                />
                                            </div>
                                        ),
                                    )}
                                </div>
                            </RadioGroup.Root>
                        </div>

                        <div className="flex justify-between">
                            <Button
                                variant="basic"
                                onClick={() =>
                                    setCurrentQuestionIndex((prev) =>
                                        Math.max(0, prev - 1),
                                    )
                                }
                                disabled={currentQuestionIndex === 0}
                                size="sm"
                            >
                                Câu trước
                            </Button>
                            {currentQuestionIndex ===
                            exam.totalQuestions - 1 ? (
                                Object.keys(answers).length ===
                                exam.totalQuestions ? (
                                    <Button
                                        loading={isSubmitted}
                                        disabled={isSubmitted}
                                        onClick={handleSubmit}
                                        size="sm"
                                    >
                                        Nộp bài
                                    </Button>
                                ) : (
                                    <ButtonSubmitExam
                                        isSubmitted={isSubmitted}
                                        handleSubmit={handleSubmit}
                                    />
                                )
                            ) : (
                                <Button
                                    variant="basic"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentQuestionIndex(
                                            (prev) => prev + 1,
                                        )
                                    }
                                >
                                    Câu tiếp theo
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-10 gap-2">
                            {exam.questions.map((q, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        setCurrentQuestionIndex(index)
                                    }
                                    className={clsx(
                                        "aspect-square rounded border-2 flex items-center justify-center text-sm",
                                        currentQuestionIndex === index &&
                                            "bg-yellow-100 border-yellow-600",
                                        !!answers[index + 1] &&
                                            "bg-green-100! border-green-600!",
                                    )}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default ExamView;
