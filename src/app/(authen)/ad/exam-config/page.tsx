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
import { Switch } from "@radix-ui/themes";
import { Download, Edit, Eye, FileText, Filter, Search, Trash2 } from "lucide-react";
import { useState } from "react";

interface ExamSet {
  id: string;
  name: string;
  subject: string;
  questionCount: number;
  duration: number;
  createdAt: Date;
  status: "active" | "inactive";
  usedCount: number;
}

const status = [
  { label: "Tất cả", value: "all" },
  { label: "Áp dụng", value: "active" },
  { label: "Ngừng áp dụng", value: "inactive" },
];

export default function ExamSetList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data
  const examSets: ExamSet[] = [
    {
      id: "1",
      name: "Kiểm tra giữa kỳ - Đề 1",
      subject: "Lập trình Web",
      questionCount: 30,
      duration: 60,
      createdAt: new Date("2025-01-01"),
      status: "active",
      usedCount: 45,
    },
    {
      id: "2",
      name: "Kiểm tra giữa kỳ - Đề 2",
      subject: "Lập trình Web",
      questionCount: 30,
      duration: 60,
      createdAt: new Date("2025-01-01"),
      status: "active",
      usedCount: 38,
    },
    {
      id: "3",
      name: "Kiểm tra cuối kỳ - Đề A",
      subject: "Cơ sở dữ liệu",
      questionCount: 50,
      duration: 90,
      createdAt: new Date("2024-12-15"),
      status: "active",
      usedCount: 67,
    },
    {
      id: "4",
      name: "Kiểm tra cuối kỳ - Đề B",
      subject: "Cơ sở dữ liệu",
      questionCount: 50,
      duration: 90,
      createdAt: new Date("2024-12-15"),
      status: "inactive",
      usedCount: 52,
    },
    {
      id: "5",
      name: "Ôn tập chương 1-3",
      subject: "Mạng máy tính",
      questionCount: 25,
      duration: 45,
      createdAt: new Date("2024-12-10"),
      status: "active",
      usedCount: 23,
    },
    {
      id: "6",
      name: "Kiểm tra định kỳ tháng 12",
      subject: "Hệ điều hành",
      questionCount: 40,
      duration: 75,
      createdAt: new Date("2024-12-01"),
      status: "active",
      usedCount: 91,
    },
  ];

  const subjects = ["Lập trình Web", "Cơ sở dữ liệu", "Mạng máy tính", "Hệ điều hành", "Cấu trúc dữ liệu"];

  const filteredExamSets = examSets.filter((exam) => {
    const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === "all" || exam.subject === filterSubject;
    const matchesStatus = filterStatus === "all" || exam.status === filterStatus;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const stats = {
    total: examSets.length,
    active: examSets.filter((e) => e.status === "active").length,
    totalUsage: examSets.reduce((sum, e) => sum + e.usedCount, 0),
    avgQuestions: Math.round(examSets.reduce((sum, e) => sum + e.questionCount, 0) / examSets.length),
  };

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
                <p className="text-3xl mt-1">{stats.total}</p>
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
                <p className="text-3xl mt-1">{stats.active}</p>
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
                <p className="text-3xl mt-1">{stats.totalUsage}</p>
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
                <p className="text-3xl mt-1">{stats.avgQuestions}</p>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="font-medium">Danh sách bộ đề</CardTitle>
              <CardDescription className="text-xs">Tìm kiếm và lọc theo môn học, trạng thái</CardDescription>
            </div>
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

            <SelectRadix items={status} bindLabel="label" bindValue="value" placeholder="Chọn trạng thái" />
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
                  <TableHead className="text-center sticky top-0">Thao tác</TableHead>
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
                          {exam.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{exam.questionCount}</TableCell>
                      <TableCell className="text-center">{exam.duration} phút</TableCell>
                      <TableCell>{exam.createdAt.toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell className="text-center">
                        <Switch />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button tooltip="Xem chi tiết" variant="basic">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="basic" tooltip="Tải xuống">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="basic" tooltip="Chỉnh sửa">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="basic" tooltip="Xóa" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
