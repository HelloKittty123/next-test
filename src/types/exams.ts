export type Exam = {
  fileName: string;
  createdAt: string;
  numExams: number;
  numQuestionsPerExam: number;
};

export type PayloadExamConfig = {
  id: string;
  title: string;
  numExams: number;
  numQuestions: number;
  duration: number;
};
