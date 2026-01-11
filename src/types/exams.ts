import { Question } from "./question";

export type Exam = {
    id: string;
    title: string;
    numExams: number;
    numQuestions: number;
    duration: string;
    excelFile: string;
    createdAt: string;
    updatedAt: string;
    status: ExamStatus;
    exams?: ExamDetail[];
};

export enum ExamStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
}

export type PayloadExamConfig = {
    id?: string;
    title: string;
    numExams: number;
    numQuestions: number;
    duration: number;
};

export type ExamDetail = {
    examCode: string;
    questionsCount: number;
    questions: Question[];
};
