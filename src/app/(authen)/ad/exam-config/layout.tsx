import { ExamConfigsProvider } from "@contexts";

interface IExamConfigLayoutProps {
  children: React.ReactNode;
}

function ExamConfigLayout({ children }: IExamConfigLayoutProps) {
  return <ExamConfigsProvider>{children}</ExamConfigsProvider>;
}

export default ExamConfigLayout;
