import { NextResponse } from "next/server";
import { listMedia, insertMedia } from "@/lib/repositories/media";
import { uploadImage, buildBlurDataURL } from "@/lib/cloudinary";
import { requireApiSession, SessionExpiredError, sessionExpiredResponse } from "@/lib/auth";

export const runtime = "nodejs";

// Vercel hard-caps serverless function request bodies at 4.5MB — not
// configurable — so this stays under that regardless of what the app itself
// would otherwise allow, with headroom for multipart overhead.
const MAX_BYTES = 4 * 1024 * 1024;

export async function GET() {
  try {
    await requireApiSession();
  } catch (error) {
    if (error instanceof SessionExpiredError) return sessionExpiredResponse();
    throw error;
  }
  const media = await listMedia();
  return NextResponse.json(media);
}

export async function POST(request: Request) {
  try {
    await requireApiSession();
  } catch (error) {
    if (error instanceof SessionExpiredError) return sessionExpiredResponse();
    throw error;
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const alt = String(formData.get("alt") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file provided." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "File must be an image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ message: "Image must be under 4MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const uploaded = await uploadImage(buffer, "uploads");
    const blurDataURL = await buildBlurDataURL(uploaded.blurUrl ?? uploaded.publicId);
    const ratio = uploaded.width / uploaded.height >= 1 ? ("3:2" as const) : ("4:5" as const);

    const asset = {
      publicId: uploaded.publicId,
      secureUrl: uploaded.secureUrl,
      alt,
      ratio,
      blurDataURL,
      width: uploaded.width,
      height: uploaded.height,
      createdAt: new Date().toISOString(),
    };

    await insertMedia(asset);
    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error("[admin/media] upload failed", error);
    return NextResponse.json({ message: "Upload failed." }, { status: 502 });
  }
}
