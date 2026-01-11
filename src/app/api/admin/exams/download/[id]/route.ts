import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Khai báo Promise cho Next.js 15
) {
    try {
        // 1. Await params để lấy ID từ đường dẫn
        const { id } = await params;

        // 2. Đọc file cấu hình để tìm tên file Excel
        const configPath = path.join(
            process.cwd(),
            "data",
            "exams-config.json"
        );
        if (!fs.existsSync(configPath)) {
            return NextResponse.json(
                { error: "Dữ liệu cấu hình không tồn tại" },
                { status: 404 }
            );
        }

        const configs = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        const examInfo = configs.find((item: any) => item.id === id);

        if (!examInfo || !examInfo.excelFile) {
            return NextResponse.json(
                { error: "Không tìm thấy bộ đề với ID này" },
                { status: 404 }
            );
        }

        // 3. Xác định đường dẫn file vật lý
        const fileName = examInfo.excelFile;
        const filePath = path.join(process.cwd(), "data", "exams", fileName);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json(
                { error: "File vật lý đã bị xóa khỏi server" },
                { status: 404 }
            );
        }

        // 4. Đọc nội dung file
        const fileBuffer = fs.readFileSync(filePath);

        // 5. Trả về Response download
        // Sử dụng encodeURIComponent để xử lý tên file có dấu tiếng Việt
        const safeFileName = encodeURIComponent(fileName);

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename*=UTF-8''${safeFileName}`,
            },
        });
    } catch (error: any) {
        console.error("Lỗi Download API:", error);
        return NextResponse.json(
            { error: "Lỗi hệ thống: " + error.message },
            { status: 500 }
        );
    }
}
