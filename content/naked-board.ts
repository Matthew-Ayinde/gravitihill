import { unstable_cache } from "next/cache";
import type { NakedBoard } from "@/lib/schemas";
import { getNakedBoard as readNakedBoardDoc } from "@/lib/repositories/naked-board";

/**
 * THE NAKED BOARD: the proprietary executive coaching platform.
 *
 * ── CMS seam ────────────────────────────────────────────────────────────────
 * Data layer for /the-naked-board and the dark teaser on /, backed by
 * MongoDB. Singleton document: `npm run seed` (or a first save from
 * /admin/naked-board) must exist before these pages can render.
 */

const TAG = "nakedBoard";

const readNakedBoard = unstable_cache(async () => readNakedBoardDoc(), [TAG], {
  tags: [TAG],
  revalidate: 3600,
});

export async function getNakedBoard(): Promise<NakedBoard> {
  const doc = await readNakedBoard();
  if (!doc) {
    throw new Error(
      'The Naked Board has no content yet. Run "npm run seed" or save it from /admin/naked-board.',
    );
  }
  return doc;
}
