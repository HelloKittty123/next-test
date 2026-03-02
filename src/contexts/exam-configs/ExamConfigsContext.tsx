"use client";

import { Question } from "@types";
import { createContext, Dispatch, SetStateAction } from "react";

export interface IExamConfigsContext {
  questions?: Question[];
  setQuestions: Dispatch<SetStateAction<Question[] | undefined>>;
  file?: File;
  setFile: Dispatch<SetStateAction<File | undefined>>;
}

export const ExamConfigsContext = createContext<IExamConfigsContext | undefined>(undefined);
