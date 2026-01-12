"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  SelectRadix,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components";
import { useLoading } from "@hooks";
import { Switch } from "@radix-ui/themes";
import { deleteExamAPI, downloadExamAPI, getListExamAPI, updateExamStatusConfigAPI } from "@services";
import { Exam, ExamStatus } from "@types";
import { formatDate } from "@utils";
import { Download, Edit, Eye, FileText, Plus, Search, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AlertDeleteDialog from "./AlertDeleteDialog";

const status = [
  { label: "Tất cả", value: "all" },
  { label: "Áp dụng", value: ExamStatus.ACTIVE },
  { label: "Ngừng áp dụng", value: ExamStatus.INACTIVE },
];

export default function ExamSetList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [exams, setExams] = useState<Exam[]>([]);

  const { setLoading } = useLoading();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    getListExam();
  }, []);

  const getListExam = async () => {
    try {
      const listExam = await getListExamAPI();
      setExams(listExam || []);
    } catch (e) {
      toast.error("Có lỗi xảy ra khi lấy danh sách bộ đề");
    }
  };

  const filteredExamSets = exams.filter((exam) => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === "all" ? true : exam.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const updateStatusExamConfig = async (checked: boolean, exam: Exam) => {
    try {
      setLoading(true);
      const status = !checked ? ExamStatus.INACTIVE : ExamStatus.ACTIVE;
      await updateExamStatusConfigAPI({ id: exam.id, status });
      setExams((prev) => prev.map((e) => (e.id === exam.id ? { ...exam, status } : e)));
      toast.success("Thay đổi trạng thái thành công");
    } catch (err) {
      toast.error("Thay đổi trạng thái thất bại");
    }

    setLoading(false);
  };

  const downloadExam = async (exam: Exam) => {
    toast.info("Đang chuẩn bị dữ liệu để tải xuống");
    try {
      const blob = await downloadExamAPI(exam.id);
      const url = window.URL.createObjectURL(blob!);

      const a = document.createElement("a");
      a.href = url;
      a.download = exam.excelFile;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      toast.error("Tải bộ đề thất bại");
    }
  };

  const deleteExam = async (exam: Exam) => {
    try {
      setLoading(true);
      await deleteExamAPI(exam.id);
      toast.success("Xóa bộ đề thành công");
      setExams((prev) => prev.filter((p) => p.id !== exam.id));
    } catch (e) {
      console.log(e);
      toast.error("Xóa bộ đề thất bại");
    }

    setLoading(false);
  };

  // const stats = {
  //     total: examSets.length,
  //     active: examSets.filter((e) => e.status === "active").length,
  //     totalUsage: examSets.reduce((sum, e) => sum + e.usedCount, 0),
  //     avgQuestions: Math.round(
  //         examSets.reduce((sum, e) => sum + e.questionCount, 0) /
  //             examSets.length
  //     ),
  // };

  return (
    <div className="w-full h-full bg-gray-50 p-6 flex flex-col gap-3">
      <div>
        <h1 className="text-3xl mb-2 font-semibold">Danh sách bộ đề</h1>
        <p className="text-gray-600 text-xs">Quản lý và thống kê các bộ đề thi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng số bộ đề</p>
                {/* <p className="text-3xl mt-1">{stats.total}</p> */}
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang sử dụng</p>
                {/* <p className="text-3xl mt-1">{stats.active}</p> */}
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Không sử dụng</p>
                <p className="text-3xl mt-1">{/* {stats.totalUsage} */}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Số câu hỏi</p>
                <p className="text-3xl mt-1">{/* {stats.avgQuestions} */}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="flex flex-1 min-h-0 gap-3 flex flex-col">
        <CardHeader>
          <div className="flex items-center md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col">
              <CardTitle className="font-medium">Danh sách bộ đề</CardTitle>
              <CardDescription className="text-xs">Tìm kiếm và lọc theo môn học, trạng thái</CardDescription>
            </div>
            <Button size="sm" className="gap-0!" onClick={() => router.push(`${pathname}/add`)}>
              <Plus size={20}></Plus>
              <span>Thêm mới</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 flex flex-col gap-3">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên đề..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <SelectRadix
              items={status}
              bindLabel="label"
              bindValue="value"
              placeholder="Chọn trạng thái"
              onChange={(e) => setFilterStatus(e)}
              value={filterStatus}
            />
          </div>

          <div className="border rounded-lg overflow-auto max-h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky top-0">Tên đề thi</TableHead>
                  <TableHead className="text-center sticky top-0">Số câu</TableHead>
                  <TableHead className="text-center sticky top-0">Thời gian</TableHead>
                  <TableHead className="sticky top-0">Ngày tạo</TableHead>
                  <TableHead className="text-center sticky top-0">Trạng thái</TableHead>
                  <TableHead className="text-center sticky top-0">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExamSets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Không tìm thấy bộ đề nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExamSets.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          {exam.title}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{exam.numQuestions}</TableCell>
                      <TableCell className="text-center">{exam.duration} phút</TableCell>
                      <TableCell>{formatDate(exam.createdAt, "DD/MM/YYYY HH:mm")}</TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={exam.status === "active"}
                          onCheckedChange={(e) => updateStatusExamConfig(e, exam)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            tooltip="Xem chi tiết"
                            variant="basic"
                            onClick={() => router.push(`${pathname}/detail/${exam.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="basic" tooltip="Tải xuống" onClick={() => downloadExam(exam)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          {/* <Button variant="basic" tooltip="Chỉnh sửa">
                            <Edit className="h-4 w-4" />
                          </Button> */}
                          <AlertDeleteDialog exam={exam} deleteExam={deleteExam} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
