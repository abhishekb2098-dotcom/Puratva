import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error("Turso DATABASE URL is not set in env (TURSO_DATABASE_URL or DATABASE_URL)");
}

const client = createClient({ url, authToken });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, imageUrl, filename, metadata } = body;

    let finalUrl: string;
    let fileName: string | undefined = filename;

    if (imageUrl) {
      finalUrl = imageUrl;
      if (!fileName) fileName = imageUrl.split("/").pop();
    } else if (imageBase64) {
      const upload = await uploadImage(imageBase64, "puratva/uploads");
      finalUrl = upload.url;
      fileName = fileName ?? upload.public_id;
    } else {
      return NextResponse.json({ success: false, error: "imageBase64 or imageUrl is required" }, { status: 400 });
    }

    // Prepare record
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const metaStr = metadata ? JSON.stringify(metadata) : "{}";

    // Insert into Turso (photos table assumed)
    await client.execute({
      sql: `INSERT INTO photos (id, url, filename, metadata, created_at) VALUES (?, ?, ?, ?, ?)` ,
      args: [id, finalUrl, fileName ?? "", metaStr, createdAt],
    });

    return NextResponse.json({ success: true, data: { id, url: finalUrl, filename: fileName, metadata } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const res = await client.execute("SELECT id, url, filename, metadata, created_at FROM photos ORDER BY created_at DESC LIMIT 50");
    return NextResponse.json({ success: true, data: res.rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
