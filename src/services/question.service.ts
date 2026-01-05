import { Question } from "@types";
import { fetchData } from "@utils";

export const getQuestionAPI = () => {
  return fetchData<Question[]>({
    api: "/api/admin/questionnaire",
    method: "GET",
  });
};

export const uploadQuestionAPI = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return fetchData<{ message: string }>({
    api: "/api/admin/questionnaire",
    method: "POST",
    payload: formData,
    requestContentType: "formData",
  });
};
