"use client";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components";
import { ScrollArea, Separator } from "@radix-ui/themes";
import { Exam, ExamDetail } from "@types";
import { CheckCircle, Download, FileText } from "lucide-react";

interface IExamItemDetailProps {
  selectedExam: ExamDetail | undefined;
  exam: Exam | undefined;
}

function ExamItemDetail({ selectedExam, exam }: IExamItemDetailProps) {
  const handleExportExam = () => {};

  return (
    <Card className="col-span-12 lg:col-span-8 max-h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[6px]">
            <CardTitle className="text-lg font-semibold">Chi tiết câu hỏi</CardTitle>
            <CardDescription className="text-xs">
              {selectedExam
                ? `${exam?.numQuestions} câu hỏi trong "Đề ${selectedExam.examCode.split("_").pop()}"`
                : "Chọn đề để xem câu hỏi"}
            </CardDescription>
          </div>
          {selectedExam && (
            <Button size="sm" onClick={handleExportExam}>
              <div className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Xuất đề
              </div>
            </Button>
          )}
        </div>
      </CardHeader>
      <Separator className="w-full!" />
      <ScrollArea className="flex-1 min-h-0">
        <CardContent className="pt-4">
          {selectedExam ? (
            <div className="space-y-4">
              {selectedExam.questions.map((question, index) => (
                <Card key={`${question.Id}_${question.STT}`} className="border-2">
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
                              question.Answer === option.label ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
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
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Chọn đề thi để xem chi tiết câu hỏi</p>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export default ExamItemDetail;
