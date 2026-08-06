import { getDb } from "@/lib/mongodb";
import { mediaAssetSchema, type MediaAsset } from "@/lib/schemas";
import type { Img } from "@/lib/schemas";

const COLLECTION = "media";
type Doc = MediaAsset & { _id: string };

async function collection() {
  return (await getDb()).collection<Doc>(COLLECTION);
}

function strip(doc: Doc): MediaAsset {
  const { _id, ...rest } = doc;
  return mediaAssetSchema.parse(rest);
}

/** Newest first — the order the media library grid shows. */
export async function listMedia(): Promise<MediaAsset[]> {
  const docs = await (await collection()).find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(strip);
}

export async function insertMedia(input: MediaAsset): Promise<void> {
  const data = mediaAssetSchema.parse(input);
  await (await collection()).replaceOne(
    { _id: data.publicId },
    data,
    { upsert: true },
  );
}

export async function updateMediaAlt(publicId: string, alt: string): Promise<void> {
  await (await collection()).updateOne({ _id: publicId }, { $set: { alt } });
}

export async function deleteMedia(publicId: string): Promise<void> {
  await (await collection()).deleteOne({ _id: publicId });
}

/** The embeddable snapshot a content document stores inline — matches `imageSchema`. */
export function toImg(asset: MediaAsset): Img {
  return {
    src: asset.secureUrl,
    alt: asset.alt,
    ratio: asset.ratio,
    blurDataURL: asset.blurDataURL,
  };
}
