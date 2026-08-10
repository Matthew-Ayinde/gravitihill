import { NextResponse } from "next/server";
import { uploadVideo, destroyVideo, publicIdFromUrl } from "@/lib/cloudinary";
import { requireApiSession, SessionExpiredError, sessionExpiredResponse } from "@/lib/auth";

export const runtime = "nodejs";

// Tighter than the general image cap (see app/api/admin/media/route.ts):
// hero clips sit behind the headline as the LCP background, and the brief's
// own guidance for ambient video (see imageSchema.video in lib/schemas.ts)
// is "under ~8 seconds and ~1.5MB" — 3MB leaves headroom above that without
// getting anywhere near a size that would visibly cost load time. Also well
// under Vercel's 4.5MB serverless body hard cap.
const MAX_BYTES = 3 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    await requireApiSession();
  } catch (error) {
    if (error instanceof SessionExpiredError) return sessionExpiredResponse();
    throw error;
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file provided." }, { status: 400 });
  }
  if (!file.type.startsWith("video/")) {
    return NextResponse.json({ message: "File must be a video." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ message: "Video must be under 3MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const uploaded = await uploadVideo(buffer, "hero");
    return NextResponse.json({ url: uploaded.secureUrl }, { status: 201 });
  } catch (error) {
    console.error("[admin/hero-video] upload failed", error);
    return NextResponse.json({ message: "Upload failed." }, { status: 502 });
  }
}

/**
 * Destroys a previously-uploaded hero clip in Cloudinary. Unlike images —
 * which live in the shared media library and may be reused across several
 * content fields — a hero video has no library and no other reuse path, so
 * whenever the admin UI detaches one (replaced, removed, or its slide
 * deleted) it is gone for good rather than left orphaned in storage.
 */
export async function DELETE(request: Request) {
  try {
    await requireApiSession();
  } catch (error) {
    if (error instanceof SessionExpiredError) return sessionExpiredResponse();
    throw error;
  }

  const body = (await request.json().catch(() => null)) as { url?: string } | null;
  const url = body?.url;
  if (!url) {
    return NextResponse.json({ message: "No url provided." }, { status: 400 });
  }

  const publicId = publicIdFromUrl(url);
  if (!publicId) {
    return NextResponse.json({ message: "Could not resolve the asset." }, { status: 400 });
  }

  try {
    await destroyVideo(publicId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin/hero-video] destroy failed", error);
    return NextResponse.json({ message: "Delete failed." }, { status: 502 });
  }
}
