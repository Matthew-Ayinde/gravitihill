import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary is the media backend: uploads and blur placeholders happen here
 * so nothing downstream (EditorialImage, PersonPortrait, AmbientVideo) has to
 * know images come from Cloudinary rather than /public — they just receive
 * the same `Img` shape either way.
 *
 * ── No baked-in edits ───────────────────────────────────────────────────────
 * Uploads are stored as close to what the admin chose as possible: only a
 * non-destructive size cap and automatic format/quality selection are
 * applied — no forced crop, no colour grade. content/media.ts's "cool-slate"
 * treatment is reproduced live as a CSS overlay by EditorialImage
 * (bg-ridge/8–14%), not baked into the file, so it never permanently alters
 * an admin's own upload and can be tuned without re-processing anything.
 */

let configured = false;

function configure() {
  if (configured) return;
  cloudinary.config({
    cloud_name: required("CLOUDINARY_CLOUD_NAME"),
    api_key: required("CLOUDINARY_API_KEY"),
    api_secret: required("CLOUDINARY_API_SECRET"),
    secure: true,
  });
  configured = true;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. Add it to .env.local — see README §Environment.`,
    );
  }
  return value;
}

// Downscales only if the source exceeds this — never upscales, never crops —
// so the full original frame is always preserved. Same `limit` pattern as
// uploadVideo below, just capping a larger dimension since stills don't need
// to stream.
const UPLOAD_TRANSFORM = [
  { crop: "limit", width: 2400, height: 2400 },
  { fetch_format: "auto", quality: "auto:good" },
] as const;

// Requested as an `eager` derivative so Cloudinary produces it alongside the
// main asset in the same upload call, instead of a second on-demand
// transformation the first time something requests it.
const BLUR_EAGER_TRANSFORM = {
  width: 24,
  crop: "scale",
  effect: "blur:1000",
  quality: 30,
  fetch_format: "jpg",
} as const;

export type UploadedImage = {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  blurUrl?: string;
};

/** Uploads a buffer unaltered but for a size cap and format/quality selection. `folder` groups assets in Cloudinary's console. */
export function uploadImage(
  buffer: Buffer,
  folder: string,
  publicId?: string,
): Promise<UploadedImage> {
  configure();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `gravitihill/${folder}`,
        public_id: publicId,
        overwrite: Boolean(publicId),
        transformation: [...UPLOAD_TRANSFORM],
        eager: [BLUR_EAGER_TRANSFORM],
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Cloudinary upload failed"));
        resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url,
          width: result.width,
          height: result.height,
          blurUrl: result.eager?.[0]?.secure_url,
        });
      },
    );
    stream.end(buffer);
  });
}

/**
 * Base64-encodes a tiny blurred derivative for next/image's blur placeholder.
 * Pass the `blurUrl` an upload's `eager` transform already produced when
 * available — the derivative is already computed, so this just downloads a
 * couple of KB — falling back to deriving one by publicId for assets
 * uploaded before `eager` was requested.
 */
export async function buildBlurDataURL(source: string): Promise<string> {
  configure();
  const url = source.startsWith("http")
    ? source
    : cloudinary.url(source, {
        transformation: [
          { width: 24, crop: "scale" },
          { effect: "blur:1000", quality: 30, fetch_format: "jpg" },
        ],
      });
  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

export async function destroyImage(publicId: string): Promise<void> {
  configure();
  await cloudinary.uploader.destroy(publicId);
}

export type UploadedVideo = {
  publicId: string;
  secureUrl: string;
};

/**
 * Uploads a video (the hero background's optional ambient clip). No brand
 * grade — that transform is image-only — just format/quality plus a
 * resolution ceiling: `limit` only downscales a source larger than 1920px
 * wide, it never upscales a smaller one. Paired with the byte cap in
 * app/api/admin/hero-video/route.ts, this keeps a background clip from
 * costing the visitor more than a short, modest loop should — a 4K source
 * would otherwise stay 4K (just re-encoded) even under the byte cap, at the
 * cost of visibly worse compression for no size or load-time benefit.
 */
export function uploadVideo(buffer: Buffer, folder: string): Promise<UploadedVideo> {
  configure();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: `gravitihill/${folder}`,
        transformation: [
          { width: 1920, crop: "limit" },
          { fetch_format: "auto", quality: "auto:good" },
        ],
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Cloudinary video upload failed"));
        resolve({ publicId: result.public_id, secureUrl: result.secure_url });
      },
    );
    stream.end(buffer);
  });
}

export async function destroyVideo(publicId: string): Promise<void> {
  configure();
  await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
}

/**
 * Recovers a Cloudinary public_id from a delivery URL, e.g.
 * `.../video/upload/v1699999999/gravitihill/hero/abc123.mp4` →
 * `gravitihill/hero/abc123`. Needed because a hero slide's video is stored
 * on the content document as a URL, not a public_id (imageSchema.video is
 * just `{ mp4?, webm? }` — the same shape used for the read-only ambient
 * enhancement elsewhere), so destroying it later has to work backwards from
 * the URL alone.
 */
export function publicIdFromUrl(url: string): string | undefined {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+(?:\?.*)?$/);
  return match?.[1];
}
