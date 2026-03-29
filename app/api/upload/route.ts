import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file" });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = Date.now() + "-" + file.name;
  const filePath = path.join(process.cwd(), "public/uploads", fileName);

  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({
    url: `/uploads/${fileName}`
  });
}