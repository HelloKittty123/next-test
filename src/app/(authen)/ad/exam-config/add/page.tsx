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
  Spinner,
  TextCustom,
} from "@components";
import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useExamConfig } from "@hooks";
import { ScrollArea } from "@radix-ui/themes";
import { createExamConfigAPI } from "@services";
import { CheckCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { number, object, string } from "yup";

export interface IExamSet {
  title: string;
  symbol: string;
  turn?: number;
  numExams: number;
  numQuestions: number;
  duration: number;
  questionPast: number;
}

const schema = object({
  title: string().required("Đây là trường bắt buộc"),
  symbol: string().required("Đây là trường bắt buộc"),
  turn: number().min(0, "Trường này không thể nhỏ hơn 0"),
  numExams: number().min(2, "Trường này không thể nhỏ hơn 2").required("Đây là trường bắt buộc"),
  numQuestions: number().min(5, "Trường này không thể nhỏ hơn 5").required("Đây là trường bắt buộc"),
  duration: number().min(5, "Trường này không thể nhỏ hơn 5").required("Đây là trường bắt buộc"),
  questionPast: number().min(1, "Trường này không thể nhỏ hơn 1").required("Đây là trường bắt buộc"),
});

export default function ExamSetCreator() {
  const [loadingQuestion, setLoadingQuestion] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      symbol: "",
      turn: 1,
      numExams: 2,
      numQuestions: 5,
      duration: 5,
      questionPast: 1,
    },
  });

  const router = useRouter();

  const { questions, file } = useExamConfig();

  useEffect(() => {
    if (!questions?.length) {
      router.push("/ad/exam-config/upload-question");
    } else {
      setLoadingQuestion(false);
    }
  }, [questions]);

  const handleOnSubmit = async (formData: IExamSet) => {
    try {
      setLoading(true);
      const body = new FormData();
      body.append("file", file!);
      body.append("dto", JSON.stringify(formData));

      const examSet = await createExamConfigAPI(body);
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
        <p className="text-gray-600">Tạo các bộ đề thi từ ngân hàng câu hỏi</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1  overflow-auto">
        <Card className="max-h-full h-fit min-h-[450px] overflow-auto">
          <CardHeader>
            <CardTitle className="font-medium text-base">Thông tin bộ đề</CardTitle>
            <CardDescription className="text-xs">Điền thông tin để tạo bộ đề thi mới</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Controller
                name="title"
                control={control}
                render={({ field: { onChange, onBlur, value, name, disabled }, fieldState: { error } }) => (
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
                    placeholder="VD: Kiểm tra lên chức"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="symbol"
                control={control}
                render={({ field: { onChange, onBlur, value, name, disabled }, fieldState: { error } }) => (
                  <Input
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    error={error}
                    value={value}
                    label={{
                      text: "Ký hiệu",
                      required: true,
                    }}
                    type="text"
                    placeholder="VD: KHCN"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="turn"
                control={control}
                render={({ field: { onChange, onBlur, value, name, disabled }, fieldState: { error } }) => (
                  <Input
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    error={error}
                    value={value}
                    label={{
                      text: "Lần thi",
                      required: false,
                    }}
                    type="number"
                    placeholder="VD: 0"
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Controller
                  name="numQuestions"
                  control={control}
                  render={({ field: { onChange, onBlur, value, name, disabled }, fieldState: { error } }) => (
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
                  render={({ field: { onChange, onBlur, value, name, disabled }, fieldState: { error } }) => (
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Controller
                  name="questionPast"
                  control={control}
                  render={({ field: { onChange, onBlur, value, name, disabled }, fieldState: { error } }) => (
                    <Input
                      onChange={onChange}
                      onBlur={onBlur}
                      disabled={disabled}
                      error={error}
                      value={value}
                      label={{
                        text: "Số câu hỏi đạt",
                        required: true,
                      }}
                      type="number"
                      placeholder="VD: 1"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Controller
                  name="numExams"
                  control={control}
                  render={({ field: { onChange, onBlur, value, name, disabled }, fieldState: { error } }) => (
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
              </div>
            </div>

            <div className="space-y-2">
              <TextCustom
                className="text-xs text-gray-500"
                text=" Hệ thống sẽ tự động tạo đề khác nhau từ ngân hàng câu hỏi"
              />
            </div>
            <div className="space-y-2">
              <TextCustom className="text-xs text-gray-500" text="Quy tắc sinh mã đề: Ký hiệu-Năm-Lần thi-STT" />
            </div>

            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Button variant="basic" size="sm" onClick={() => router.push("/ad/exam-config")}>
                  Hủy
                </Button>
                <Button variant="cancel" size="sm" onClick={() => router.push("/ad/exam-config/upload-question")}>
                  Quay lại
                </Button>
              </div>

              <Button
                size="sm"
                onClick={handleSubmit(handleOnSubmit)}
                className=" gap-0!"
                loading={loading}
                disabled={loading}
              >
                <Plus className="h-4 w-4" />
                Tạo bộ đề
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="max-h-full h-fit overflow-auto min-h-[450px]">
          <CardHeader className="border-b border-b-[var(--border-light-theme-border-2)]">
            <CardTitle className="font-medium text-base">Thống kê ngân hàng câu hỏi</CardTitle>
            <CardDescription className="text-xs">Số lượng câu hỏi hiện có: {questions?.length} câu</CardDescription>
          </CardHeader>
          {loadingQuestion ? (
            <div className="flex-1 min-h-0 flex items-center justify-center">
              <Spinner width={35} height={35} />
            </div>
          ) : (
            <ScrollArea className="flex-1 min-h-0">
              <CardContent>
                {questions?.map((question, index) => (
                  <Card key={index} className="border-2">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Câu {index + 1}</Badge>
                          </div>
                          <h4 className="font-medium mb-3">{question.Question}</h4>
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
                              question.Answer === option.label
                                ? "bg-green-50 border-green-500"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                question.Answer === option.label
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-300 text-gray-700"
                              }`}
                            >
                              {option.label}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">{option.value}</p>
                            </div>
                            {question.Answer === option.label && (
                              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>Đáp án đúng:</span>
                          <Badge className="bg-green-600">{question.Answer}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </ScrollArea>
          )}
        </Card>
      </div>
    </div>
  );
}
