import { getDb } from "@/lib/mongodb";
import { homeHeroSchema, type HomeHero, type Img } from "@/lib/schemas";

/**
 * Singleton document — the / hero's optional background media. Raw CRUD
 * only — lib/home-hero.ts (not this file) is what pages import, since it
 * adds the fallback-to-empty behaviour for the pre-save state.
 */

const COLLECTION = "homeHero";
const SINGLETON_ID = "singleton";
type Doc = HomeHero & { _id: string; updatedAt: string };
/** Shape saved by the single-slide version of this feature, read once for migration. */
type LegacyDoc = { _id: string; updatedAt: string; media?: Img };

async function collection() {
  return (await getDb()).collection<Doc>(COLLECTION);
}

export async function getHomeHero(): Promise<HomeHero | undefined> {
  const doc = await (await collection()).findOne({ _id: SINGLETON_ID });
  if (!doc) return undefined;
  const { _id, updatedAt, ...rest } = doc;
  // A doc saved before the multi-slide version has `media`, not `items` —
  // read it as a single-item list rather than failing to parse.
  if (!("items" in rest) && "media" in rest) {
    const legacy = rest as unknown as LegacyDoc;
    return homeHeroSchema.parse({ items: legacy.media ? [legacy.media] : [] });
  }
  return homeHeroSchema.parse(rest);
}

export async function saveHomeHero(input: HomeHero): Promise<void> {
  const data = homeHeroSchema.parse(input);
  await (await collection()).replaceOne(
    { _id: SINGLETON_ID },
    { ...data, updatedAt: new Date().toISOString() },
    { upsert: true },
  );
}
