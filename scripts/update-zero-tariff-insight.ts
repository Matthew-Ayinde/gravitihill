import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { findInsight, upsertInsight } from "@/lib/repositories/insights";
import { findMediaBySrc } from "@/lib/repositories/media";
import { ZERO_TARIFF_BODY, ZERO_TARIFF_EXCERPT } from "./seed-data/zero-tariff-article";

/**
 * Writes the published text of "Converting China's Zero-Tariff Access into
 * Market Share" into its existing record — body, excerpt, reading time, and
 * the placeholder flag — and nothing else. Title, slug, date, category and
 * cover stay exactly as they are in the CMS, unlike `npm run seed`, which
 * rewrites every collection.
 *
 * The record as it stood is saved to backups/ first, so the change can be
 * undone. Run with: npm run insight:zero-tariff
 */

const SLUG = "converting-chinas-zero-tariff-access-into-market-share";

async function main() {
  const current = await findInsight(SLUG);
  if (!current) {
    console.error(`No insight with slug "${SLUG}". Create it in the admin first, or run npm run seed.`);
    process.exit(1);
  }

  const dir = path.join(process.cwd(), "backups");
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `insight-${SLUG}-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  await writeFile(file, JSON.stringify(current, null, 2));
  console.log(`  ✓ backed up current record → ${path.relative(process.cwd(), file)}`);

  // Covers chosen before dimensions were recorded get them from the library,
  // so the article shows the cover at its true proportions.
  let coverImage = current.coverImage;
  if (coverImage && !(coverImage.width && coverImage.height)) {
    const asset = await findMediaBySrc(coverImage.src);
    if (asset) {
      coverImage = { ...coverImage, width: asset.width, height: asset.height };
      console.log(`  ✓ cover dimensions ${asset.width}×${asset.height}`);
    }
  }

  await upsertInsight({
    ...current,
    coverImage,
    excerpt: ZERO_TARIFF_EXCERPT,
    readingTime: 7,
    placeholderBody: false,
    body: ZERO_TARIFF_BODY,
  });
  console.log(`  ✓ updated ${SLUG} (${ZERO_TARIFF_BODY.length} blocks)`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
