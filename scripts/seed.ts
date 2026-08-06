import { readFile } from "node:fs/promises";
import path from "node:path";
import { getDb } from "@/lib/mongodb";
import { uploadImage, type UploadedImage } from "@/lib/cloudinary";
import { MEDIA, MEDIA_CREDITS } from "@/content/media";
import type { Img } from "@/lib/schemas";

import { upsertPractice } from "@/lib/repositories/practices";
import { upsertSector } from "@/lib/repositories/sectors";
import { upsertInsight } from "@/lib/repositories/insights";
import { upsertPerson } from "@/lib/repositories/team";
import { upsertDnaPillar } from "@/lib/repositories/dna";
import { saveNakedBoard } from "@/lib/repositories/naked-board";
import { upsertSocialPost } from "@/lib/repositories/social";
import { saveAbout } from "@/lib/repositories/about";
import { saveSettings } from "@/lib/repositories/settings";
import { insertMedia } from "@/lib/repositories/media";

import { SEED_PRACTICES } from "./seed-data/practices";
import { SEED_SECTORS } from "./seed-data/sectors";
import { SEED_INSIGHTS } from "./seed-data/insights";
import { SEED_TEAM } from "./seed-data/team";
import { SEED_PILLARS } from "./seed-data/dna";
import { SEED_NAKED_BOARD } from "./seed-data/naked-board";
import { SEED_SOCIAL_POSTS } from "./seed-data/social";
import { SEED_ABOUT } from "./seed-data/about";
import { ADDRESS, EMAIL, LINKEDIN, PHONES } from "@/lib/site";
import type { IconName, Insight } from "@/lib/schemas";

/**
 * Idempotent seed. Uploads today's local photography to Cloudinary (skipping
 * assets already uploaded — Cloudinary returns the existing asset instead of
 * re-uploading when `overwrite: false` and the public_id already exists),
 * then upserts every collection from the frozen snapshots in ./seed-data.
 *
 * Reuses today's hand-authored blurDataURL values rather than regenerating
 * them, so the seeded site is pixel-identical to what ships before this
 * migration. Run with: npm run seed
 */

type MediaKey = keyof typeof MEDIA;

async function uploadSeedMedia(): Promise<Map<MediaKey, UploadedImage>> {
  const uploaded = new Map<MediaKey, UploadedImage>();

  for (const key of Object.keys(MEDIA) as MediaKey[]) {
    const source = MEDIA[key];
    const filePath = path.join(process.cwd(), "public", source.src);
    const buffer = await readFile(filePath);
    const result = await uploadImage(buffer, "seed", key);
    uploaded.set(key, result);
    console.log(`  ✓ ${key} → ${result.secureUrl}`);
  }

  return uploaded;
}

function toImg(key: MediaKey, uploaded: Map<MediaKey, UploadedImage>): Img {
  const source = MEDIA[key];
  const asset = uploaded.get(key);
  if (!asset) throw new Error(`No uploaded asset for media key "${key}"`);
  return {
    src: asset.secureUrl,
    alt: source.alt,
    ratio: source.ratio,
    blurDataURL: source.blurDataURL,
  };
}

async function seedMediaLibrary(uploaded: Map<MediaKey, UploadedImage>) {
  const creditByKey = new Map(MEDIA_CREDITS.map((c) => [c.key, c]));
  for (const key of Object.keys(MEDIA) as MediaKey[]) {
    const source = MEDIA[key];
    const asset = uploaded.get(key)!;
    const credit = creditByKey.get(key);
    await insertMedia({
      publicId: asset.publicId,
      secureUrl: asset.secureUrl,
      alt: source.alt,
      ratio: source.ratio,
      blurDataURL: source.blurDataURL,
      width: asset.width,
      height: asset.height,
      credit: credit
        ? { title: credit.title, author: credit.author, license: credit.license, source: credit.source }
        : undefined,
      createdAt: new Date().toISOString(),
    });
  }
}

async function seedPractices(uploaded: Map<MediaKey, UploadedImage>) {
  for (const p of SEED_PRACTICES) {
    await upsertPractice({
      slug: p.slug,
      name: p.name,
      proposition: p.proposition,
      thesis: p.thesis,
      offerings: p.offerings.map((o) => ({ ...o, icon: o.icon as IconName })),
      cover: toImg(p.coverKey as MediaKey, uploaded),
      relatedSectors: p.relatedSectors,
      platformHref: p.platformHref,
    });
  }
  console.log(`  ✓ ${SEED_PRACTICES.length} practices`);
}

async function seedSectors(uploaded: Map<MediaKey, UploadedImage>) {
  for (const [i, s] of SEED_SECTORS.entries()) {
    await upsertSector(
      {
        slug: s.slug,
        name: s.name,
        proposition: s.proposition,
        thesis: s.thesis,
        approach: s.approach.map((a) => ({ ...a, icon: a.icon as IconName })),
        differentiators: s.differentiators,
        image: toImg(s.imageKey as MediaKey, uploaded),
      },
      i,
    );
  }
  console.log(`  ✓ ${SEED_SECTORS.length} sectors`);
}

async function seedInsights(uploaded: Map<MediaKey, UploadedImage>) {
  for (const a of SEED_INSIGHTS) {
    await upsertInsight({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category as unknown as Insight["category"],
      author: a.author,
      publishedAt: a.publishedAt,
      readingTime: a.readingTime,
      coverImage: toImg(a.coverImageKey as MediaKey, uploaded),
      placeholderBody: a.placeholderBody,
      body: a.body as unknown as Insight["body"],
    });
  }
  console.log(`  ✓ ${SEED_INSIGHTS.length} insights`);
}

async function seedTeam() {
  for (const [i, person] of SEED_TEAM.entries()) {
    await upsertPerson({ ...person }, i);
  }
  console.log(`  ✓ ${SEED_TEAM.length} leaders`);
}

async function seedDna() {
  for (const [i, pillar] of SEED_PILLARS.entries()) {
    await upsertDnaPillar({ ...pillar, icon: pillar.icon as IconName }, i);
  }
  console.log(`  ✓ ${SEED_PILLARS.length} DNA pillars`);
}

async function seedNakedBoard() {
  await saveNakedBoard({
    ...SEED_NAKED_BOARD,
    stages: SEED_NAKED_BOARD.stages.map((s) => ({ ...s, icon: s.icon as IconName })),
  });
  console.log("  ✓ The Naked Board");
}

async function seedSocial() {
  for (const [i, post] of SEED_SOCIAL_POSTS.entries()) {
    await upsertSocialPost(post, i);
  }
  console.log(`  ✓ ${SEED_SOCIAL_POSTS.length} social posts`);
}

async function seedAbout() {
  await saveAbout(SEED_ABOUT);
  console.log("  ✓ About");
}

async function seedSettings() {
  await saveSettings({ address: ADDRESS, phones: [...PHONES], email: EMAIL, linkedin: LINKEDIN });
  console.log("  ✓ Settings (NAP)");
}

async function ensureIndexes() {
  const db = await getDb();
  // _id already carries an implicit unique index on every collection —
  // MongoDB rejects redeclaring it explicitly, so `admins` needs nothing here.
  await db.collection("contactSubmissions").createIndex({ createdAt: -1 });
  await db.collection("contactSubmissions").createIndex({ status: 1 });
}

async function main() {
  console.log("Uploading photography to Cloudinary…");
  const uploaded = await uploadSeedMedia();

  console.log("Seeding media library…");
  await seedMediaLibrary(uploaded);

  console.log("Seeding content collections…");
  await seedPractices(uploaded);
  await seedSectors(uploaded);
  await seedInsights(uploaded);
  await seedTeam();
  await seedDna();
  await seedNakedBoard();
  await seedSocial();
  await seedAbout();
  await seedSettings();

  console.log("Ensuring indexes…");
  await ensureIndexes();

  console.log("\nDone. The site should now render identically, from MongoDB + Cloudinary.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
