"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components";
import { ScrollArea, Separator, Skeleton } from "@radix-ui/themes";
import { Exam, ExamDetail } from "@types";
import { FileText } from "lucide-react";

interface IExamItem {
  exam?: Exam;
  setSelectedExam: React.Dispatch<React.SetStateAction<ExamDetail | undefined>>;
  selectedExam: ExamDetail | undefined;
}

function ExamItem({ exam, setSelectedExam, selectedExam }: IExamItem) {
  console.log(exam);
  

  return (
    <Card className="col-span-12 lg:col-span-4 max-h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Danh sách đề thi</CardTitle>
        <CardDescription className="text-xs">{exam?.numExams || 0} đề thi</CardDescription>
      </CardHeader>
      <Separator className="w-full!" />

      <ScrollArea className="flex-1 min-h-0">
        <CardContent className="pt-4 space-y-2">
          {!exam ? (
            <div className="flex flex-c ol gap-4">
              <Skeleton height="100px" />
              <Skeleton height="100px" />
            </div>
          ) : (
            exam.exams!.map((ex, index) => (
              <div
                key={ex.examCode}
                onClick={() => setSelectedExam(ex)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedExam?.examCode === ex.examCode
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-600 flex-shrink-0" />
                  <h4 className="font-medium">Đề {index + 1}</h4>
                </div>
                <div className="flex gap-2 text-xs text-gray-600">
                  <span>{exam.numQuestions} câu</span>
                  <span>•</span>
                  <span>{exam.duration} phút</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export default ExamItem;
