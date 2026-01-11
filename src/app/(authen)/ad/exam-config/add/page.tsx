"use client";

import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    TextCustom,
} from "@components";
import { useEffect, useState } from "react";

import { CheckCircle, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { createExamConfigAPI, getQuestionAPI } from "@services";
import { Question } from "@types";
import { ScrollArea } from "@radix-ui/themes";
import { number, object, string } from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { routeModule } from "next/dist/build/templates/pages";
import { useRouter } from "next/navigation";

export interface IExamSet {
    title: string;
    numExams: number;
    numQuestions: number;
    duration: number;
}

const schema = object({
    title: string().required("Đây là trường bắt buộc"),
    numExams: number()
        .min(2, "Trường này không thể nhỏ hơn 2")
        .required("Đây là trường bắt buộc"),
    numQuestions: number()
        .min(5, "Trường này không thể nhỏ hơn 5")
        .required("Đây là trường bắt buộc"),
    duration: number()
        .min(5, "Trường này không thể nhỏ hơn 5")
        .required("Đây là trường bắt buộc"),
});

export default function ExamSetCreator() {
    const [listQuestion, setListQuestion] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { handleSubmit, control, reset } = useForm({
        resolver: yupResolver(schema),
        mode: "onBlur",
        defaultValues: {
            title: "",
            numExams: 2,
            numQuestions: 5,
            duration: 5,
        },
    });

    const router = useRouter();

    useEffect(() => {
        getQuestion();
    }, []);

    const getQuestion = async () => {
        try {
            const questions = await getQuestionAPI();
            if (questions) {
                setListQuestion(questions);
            }
        } catch (e) {
            toast.error("Lấy thông tin câu hỏi thất bại");
        }
    };

    const handleOnSubmit = async (formData: IExamSet) => {
        try {
            setLoading(true);
            const examSet = await createExamConfigAPI(formData);
            if (examSet) {
                toast.success("Tạo bộ đề thành công");
                router.push("/ad/exam-config");
            }
        } catch (e) {
            toast.error("Tạo bộ đề thất bại");
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full bg-gray-50 p-6 flex flex-col gap-4 overflow-auto">
            <div>
                <h1 className="text-3xl mb-2">Tạo bộ đề thi</h1>
                <p className="text-gray-600">
                    Tạo các bộ đề thi từ ngân hàng câu hỏi
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1  overflow-auto">
                <Card className="max-h-full h-fit min-h-[520px]">
                    <CardHeader>
                        <CardTitle className="font-medium text-base">
                            Thông tin bộ đề
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Điền thông tin để tạo bộ đề thi mới
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Controller
                                name="title"
                                control={control}
                                render={({
                                    field: {
                                        onChange,
                                        onBlur,
                                        value,
                                        name,
                                        disabled,
                                    },
                                    fieldState: { error },
                                }) => (
                                    <Input
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        disabled={disabled}
                                        error={error}
                                        value={value}
                                        label={{
                                            text: "Tên bộ đề thi",
                                            required: true,
                                        }}
                                        type="text"
                                        placeholder="VD: Kiểm tra giữa kỳ"
                                    />
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Controller
                                    name="numQuestions"
                                    control={control}
                                    render={({
                                        field: {
                                            onChange,
                                            onBlur,
                                            value,
                                            name,
                                            disabled,
                                        },
                                        fieldState: { error },
                                    }) => (
                                        <Input
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            disabled={disabled}
                                            error={error}
                                            value={value}
                                            label={{
                                                text: "Số câu hỏi/đề",
                                                required: true,
                                            }}
                                            type="number"
                                            placeholder="Nhập số câu hỏi"
                                        />
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Controller
                                    name="duration"
                                    control={control}
                                    render={({
                                        field: {
                                            onChange,
                                            onBlur,
                                            value,
                                            name,
                                            disabled,
                                        },
                                        fieldState: { error },
                                    }) => (
                                        <Input
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            disabled={disabled}
                                            error={error}
                                            value={value}
                                            label={{
                                                text: "Thời gian (phút)",
                                                required: true,
                                            }}
                                            type="number"
                                            placeholder="Nhập thời gian"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Controller
                                name="numExams"
                                control={control}
                                render={({
                                    field: {
                                        onChange,
                                        onBlur,
                                        value,
                                        name,
                                        disabled,
                                    },
                                    fieldState: { error },
                                }) => (
                                    <Input
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        disabled={disabled}
                                        error={error}
                                        value={value}
                                        label={{
                                            text: "Số lượng đề",
                                            required: true,
                                        }}
                                        type="number"
                                        placeholder="Nhập số lượng đề"
                                    />
                                )}
                            />

                            <TextCustom
                                className="text-xs text-gray-500"
                                text=" Hệ thống sẽ tự động tạo đề khác
                                nhau từ ngân hàng câu hỏi"
                            />
                        </div>

                        <Button
                            onClick={handleSubmit(handleOnSubmit)}
                            className="w-full gap-0!"
                            loading={loading}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo bộ đề
                        </Button>
                        <Button
                            variant="basic"
                            className="w-full"
                            onClick={() => router.push("/ad/exam-config")}
                        >
                            Quay lại
                        </Button>
                    </CardContent>
                </Card>

                <Card className="max-h-full h-fit overflow-auto min-h-[520px]">
                    <CardHeader className="border-b border-b-[var(--border-light-theme-border-2)]">
                        <CardTitle className="font-medium text-base">
                            Thống kê ngân hàng câu hỏi
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Số lượng câu hỏi hiện có: {listQuestion.length} câu
                        </CardDescription>
                    </CardHeader>
                    <ScrollArea className="flex-1 min-h-0">
                        <CardContent>
                            {listQuestion.map((question, index) => (
                                <Card key={index} className="border-2">
                                    <CardContent className="pt-4">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="outline">
                                                        Câu {index + 1}
                                                    </Badge>
                                                </div>
                                                <h4 className="font-medium mb-3">
                                                    {question.Question}
                                                </h4>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {[
                                                {
                                                    label: "A",
                                                    value: question.A,
                                                },
                                                {
                                                    label: "B",
                                                    value: question.B,
                                                },
                                                {
                                                    label: "C",
                                                    value: question.C,
                                                },
                                                {
                                                    label: "D",
                                                    value: question.D,
                                                },
                                            ].map((option) => (
                                                <div
                                                    key={option.label}
                                                    className={`p-3 rounded-lg border-2 flex items-start gap-3 ${
                                                        question.Answer ===
                                                        option.label
                                                            ? "bg-green-50 border-green-500"
                                                            : "bg-gray-50 border-gray-200"
                                                    }`}
                                                >
                                                    <div
                                                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                            question.Answer ===
                                                            option.label
                                                                ? "bg-green-500 text-white"
                                                                : "bg-gray-300 text-gray-700"
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm">
                                                            {option.value}
                                                        </p>
                                                    </div>
                                                    {question.Answer ===
                                                        option.label && (
                                                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-3 pt-3 border-t">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <span>Đáp án đúng:</span>
                                                <Badge className="bg-green-600">
                                                    {question.Answer}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </ScrollArea>
                </Card>
            </div>
        </div>
    );
}
