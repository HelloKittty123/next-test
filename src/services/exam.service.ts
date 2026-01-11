import { Exam, ExamStatus, PayloadExamConfig } from "@types";
import { fetchData } from "@utils";

export const getListExamAPI = () => {
  return fetchData<Exam[]>({
    api: "/api/admin/exams",
    method: "GET",
  });
};

export const createExamConfigAPI = (payload: PayloadExamConfig) => {
  return fetchData<Exam>({
    api: "/api/admin/exams",
    method: "POST",
    payload,
  });
};

export const downloadExamAPI = (id: string) => {
  return fetchData<Blob>({
    api: `/api/admin/exams/download/${id}`,
    method: "GET",
    responseType: "blob",
  });
};

export const deleteExamAPI = (id: string) => {
  return fetchData({ api: `/api/admin/exams/${id}`, method: "DELETE" });
};

export const getExamByIdAPI = (id: string) => {
  return fetchData<Exam>({ api: `/api/admin/exams/${id}`, method: "GET" });
};

export const updateExamStatusConfigAPI = (payload: { id: string; status: ExamStatus }) => {
  return fetchData({ api: `/api/admin/exams`, method: "PUT", payload });
};
