import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  try {
    const configPath = path.join(process.cwd(), "data", "exams-config.json");

    if (!fs.existsSync(configPath)) {
      return NextResponse.json([]);
    }

    const data = fs.readFileSync(configPath, "utf-8");
    const configs = JSON.parse(data);

    // Trình bày danh sách từ mới nhất đến cũ nhất
    const sortedConfigs = configs
      .filter((f: any) => f.status === "active")
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(sortedConfigs);
  } catch (error: any) {
    return NextResponse.json({ error: "Không thể lấy danh sách bộ đề" }, { status: 500 });
  }
}
