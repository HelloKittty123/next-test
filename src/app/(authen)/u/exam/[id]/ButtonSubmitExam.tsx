"use client";

import { Button } from "@components";
import { AlertDialog, Flex } from "@radix-ui/themes";

export interface IButtonSubmitExam {
  handleSubmit: () => Promise<void>;
  isSubmitted: boolean;
}

function ButtonSubmitExam({ handleSubmit, isSubmitted }: IButtonSubmitExam) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button size="sm" disabled={isSubmitted} loading={isSubmitted}>
          Nộp bài
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Bạn có chắc chắn muốn nộp bài thi không?</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Bạn chưa hoàn thành hết tất cả các câu hỏi, bạn có chắc chắn muốn nộp bài không?{" "}
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button size="sm" variant="cancel">
              Hủy bỏ
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button size="sm" onClick={handleSubmit}>
              Xác nhận
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

export default ButtonSubmitExam;
