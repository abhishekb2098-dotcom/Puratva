import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);

function getExtension(file: File) {
  const fromName = path.extname(file.name || "").toLowerCase();
  if (fromName) return fromName;

  const mimeExtensions: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };

  return mimeExtensions[file.type] || ".jpg";
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!hasCloudinaryConfig) {
      const folder = (formData.get("folder") as string) || "puratva/products";
      const subfolder = folder.split("/").pop() || "products";
      const uploadDir = path.join(process.cwd(), "public", "uploads", subfolder);
      await mkdir(uploadDir, { recursive: true });

      const filename = `${Date.now()}-${randomUUID()}${getExtension(file)}`;
      await writeFile(path.join(uploadDir, filename), buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${subfolder}/${filename}`,
        public_id: null,
        storage: "local",
      });
    }

    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const folder = (formData.get("folder") as string) || "puratva/products";
    const { url, public_id } = await uploadImage(base64, folder);

    return NextResponse.json({ success: true, url, public_id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
