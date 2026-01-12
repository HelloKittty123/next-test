"use client";

import { Button } from "@components";
import { AlertDialog, Flex } from "@radix-ui/themes";
import { Exam } from "@types";
import { Trash2 } from "lucide-react";

export interface IAlertDeleteDialog {
  deleteExam: (exam: Exam) => void;
  exam: Exam;
}

function AlertDeleteDialog({ deleteExam, exam }: IAlertDeleteDialog) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button variant="basic" tooltip="Xóa" className="text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Xóa bộ đề thi</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Bạn có chắc muốn xóa bộ đề thi này không? Nếu xóa rồi sẽ không thể phục hồi.
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="cancel" size="sm">
              Hủy bỏ
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button size="sm" onClick={() => deleteExam(exam)}>
              Xác nhận
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

export default AlertDeleteDialog;
