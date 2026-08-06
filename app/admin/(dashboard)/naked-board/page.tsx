import type { Metadata } from "next";
import { getNakedBoard } from "@/lib/repositories/naked-board";
import { NakedBoardForm } from "@/components/admin/forms/NakedBoardForm";

export const metadata: Metadata = { title: "The Naked Board", robots: { index: false } };

export default async function AdminNakedBoardPage() {
  const board = await getNakedBoard();

  return (
    <div>
      <p className="type-eyebrow text-green">Content</p>
      <h1 className="type-display mt-3 text-h1">The Naked Board.</h1>
      <p className="mt-3 max-w-md text-caption text-ink-muted">
        One record — powers /the-naked-board and the dark teaser on the home page.
      </p>
      <div className="mt-12">
        <NakedBoardForm board={board} />
      </div>
    </div>
  );
}
