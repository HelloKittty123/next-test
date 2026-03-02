import { ExamConfigsContext } from "@contexts";
import { useContext } from "react";

const useExamConfig = () => {
  const context = useContext(ExamConfigsContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useExamConfig;
