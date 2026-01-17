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
    questionPast: number;
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

export type ExamTest = {
    id: string;
    title: string;
    duration: number;
    totalQuestions: number;
    examCode: string;
    date: Date;
    questions: Question[];
    questionPast: number;
};

export type ExamResult = {
    score: number;
    correctCount: number;
    totalQuestions: number;
    percentage: number;
};
