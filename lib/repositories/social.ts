import { getDb } from "@/lib/mongodb";
import { socialPostSchema, type SocialPost } from "@/lib/schemas";

const COLLECTION = "socialPosts";
type Doc = SocialPost & { _id: string; order: number; updatedAt: string };

async function collection() {
  return (await getDb()).collection<Doc>(COLLECTION);
}

function strip(doc: Doc): SocialPost {
  const { _id, order, updatedAt, ...rest } = doc;
  return socialPostSchema.parse(rest);
}

export async function listSocialPosts(): Promise<SocialPost[]> {
  const docs = await (await collection()).find({}).sort({ order: 1 }).toArray();
  return docs.map(strip);
}

export async function findSocialPost(id: string): Promise<SocialPost | undefined> {
  const doc = await (await collection()).findOne({ _id: id });
  return doc ? strip(doc) : undefined;
}

export async function upsertSocialPost(input: SocialPost, order: number): Promise<void> {
  const data = socialPostSchema.parse(input);
  await (await collection()).replaceOne(
    { _id: data.id },
    { ...data, order, updatedAt: new Date().toISOString() },
    { upsert: true },
  );
}

export async function deleteSocialPost(id: string): Promise<void> {
  await (await collection()).deleteOne({ _id: id });
}
