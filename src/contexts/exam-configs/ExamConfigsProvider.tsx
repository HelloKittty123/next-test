"use client";

import { Question } from "@types";
import { useState } from "react";
import { ExamConfigsContext } from "./ExamConfigsContext";

export const ExamConfigsProvider = ({ children }: { children: React.ReactNode }) => {
  const [questions, setQuestions] = useState<Question[] | undefined>([]);
  const [file, setFile] = useState<File | undefined>(undefined);

  return <ExamConfigsContext value={{ questions, setQuestions, file, setFile }}> {children}</ExamConfigsContext>;
};
