import { Exam, PayloadExamConfig } from "@types";
import { fetchData } from "@utils";

export const getExamAPI = () => {
  return fetchData<Exam[]>({
    api: "/api/admin/exams",
    method: "GET",
  });
};

export const createExamConfig = (payload: PayloadExamConfig) => {
  return fetchData<Exam>({
    api: "/api/admin/exams",
    method: "POST",
    payload,
  });
};
