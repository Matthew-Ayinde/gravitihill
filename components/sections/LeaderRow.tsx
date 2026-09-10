"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useInView } from "@/lib/use-in-view";
import { cn } from "@/lib/utils";

/**
 * One leader, as a split row: a portrait frame on one side, the record on the
 * other.
 *
 * The client boundary is only the two things a server cannot know — whether
 * the reader's device can hover, and whether the profile is open. Everything
 * inside `media`, `summary` and `details` is rendered on the server and passed
 * through, so no content crosses as props.
 *
 * ── How the portrait arrives ─────────────────────────────────────────────
 * The reveal itself is CSS (see LEADERSHIP INDEX in globals.css), keyed on
 * `data-revealed` plus :hover / :focus-within:
 *   · hover devices  — the portrait wipes in while the row is hovered
 *   · touch devices  — it wipes in while the row crosses the middle of the
 *                      screen, since there is no hover to ask for it
 *   · either         — it stays in while the profile is open
 *   · reduced motion — it is simply there, no wipe
 */
export function LeaderRow({
  id,
  side,
  media,
  summary,
  details,
}: {
  id: string;
  /** Which side the portrait frame sits on at ≥1024px. */
  side: "left" | "right";
  media: ReactNode;
  summary: ReactNode;
  /** Extended record. Omit when there is nothing beyond the summary. */
  details?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const detailsId = useId();
  const [open, setOpen] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const inView = useInView(ref, { margin: "-35% 0px -35% 0px" });

  useEffect(() => {
    const query = window.matchMedia("(hover: hover)");
    const update = () => setCanHover(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const revealed = open || (!canHover && inView);

  return (
    <article
      ref={ref}
      id={id}
      data-side={side}
      data-revealed={revealed}
      className="lead-row grid scroll-mt-24 border-t border-rule lg:grid-cols-2"
    >
      <div
        className={cn(
          "relative aspect-4/5 overflow-hidden sm:aspect-3/2",
          side === "right" && "lg:order-last",
        )}
      >
        {media}
      </div>

      <div className="flex flex-col justify-center px-gutter py-14 lg:py-16">
        {summary}

        {details && (
          <>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={detailsId}
              onClick={() => setOpen((value) => !value)}
              className="type-eyebrow mt-9 inline-flex items-center gap-3 self-start text-green"
            >
              <span className="border-b border-green/40 pb-1">
                {open ? "Close profile" : "View profile"}
              </span>
              <span aria-hidden="true" className="lead-arrow inline-block">
                →
              </span>
            </button>

            <div
              id={detailsId}
              data-open={open}
              inert={!open}
              className="lead-details"
            >
              <div className="overflow-hidden">{details}</div>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
