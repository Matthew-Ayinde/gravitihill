import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary is the media backend: uploads, the brand grade, and blur
 * placeholders all happen here so nothing downstream (EditorialImage,
 * PersonPortrait, AmbientVideo) has to know images come from Cloudinary
 * rather than /public — they just receive the same `Img` shape either way.
 *
 * ── The grade ────────────────────────────────────────────────────────────────
 * content/media.ts documents the brand's photographic treatment: resize to
 * 3:2, saturation 0.42 (~ -58% from neutral), contrast +7%, a 10% cool-slate
 * overlay, light sharpen. BRAND_TRANSFORM reproduces that as a Cloudinary
 * eager transformation, applied once at upload time so every consumer gets an
 * already-graded asset — re-run it on any replacement, per that file's note.
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

const BRAND_TRANSFORM = [
  { crop: "fill", gravity: "auto", width: 1600, height: 1067 },
  { effect: "saturation:-58" },
  { effect: "contrast:7" },
  { color: "rgb:1a2e26", effect: "colorize:10" },
  { effect: "sharpen:60" },
  { fetch_format: "auto", quality: "auto:good" },
] as const;

export type UploadedImage = {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
};

/** Uploads a buffer with the brand grade baked in. `folder` groups assets in Cloudinary's console. */
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
        transformation: [...BRAND_TRANSFORM],
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Cloudinary upload failed"));
        resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url,
          width: result.width,
          height: result.height,
        });
      },
    );
    stream.end(buffer);
  });
}

/**
 * A tiny (24px-wide), heavily blurred, low-quality derivative, fetched and
 * base64-encoded — the same shape as the hand-authored `blurDataURL` strings
 * already in content/media.ts, generated instead of hand-authored for any
 * upload made through the admin panel.
 */
export async function buildBlurDataURL(publicId: string): Promise<string> {
  configure();
  const url = cloudinary.url(publicId, {
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
