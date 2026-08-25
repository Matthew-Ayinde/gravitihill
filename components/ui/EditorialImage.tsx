import Image from "next/image";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { ParallaxFrame } from "@/components/ui/ParallaxFrame";
import type { Img } from "@/lib/schemas";
import { cn } from "@/lib/utils";

/**
 * The only way an image enters a page.
 *
 * Rules it enforces so callers cannot break them:
 *   · aspect ratio is 3:2 or 4:5, nothing else
 *   · full-bleed or column-aligned — never floated mid-paragraph
 *   · a --ridge overlay at 8–14% on dark panels, so a mismatched library still
 *     reads as one consistent grade
 *   · alt text is required by the schema; decorative images pass alt: ""
 *
 * ── Absent imagery is the expected state ────────────────────────────────────
 * The brief requires the site to be complete and composed with no photography
 * present. When `image` is undefined this renders a toned typographic plate
 * carrying the caption — a deliberate surface, not an empty box or a grey
 * rectangle with a broken-image glyph. Dropping real photography in later is a
 * content change with no layout consequence.
 */

const RATIO: Record<NonNullable<Img["ratio"]>, string> = {
  "3:2": "aspect-3/2",
  "4:5": "aspect-4/5",
};

export function EditorialImage({
  image,
  caption,
  tone = "light",
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  ratio = "3:2",
}: {
  image?: Img;
  /** Shown on the plate when no image exists, and as a figcaption when one does. */
  caption?: string;
  tone?: "light" | "dark";
  className?: string;
  sizes?: string;
  priority?: boolean;
  ratio?: Img["ratio"];
}) {
  const effectiveRatio = image?.ratio ?? ratio;

  if (!image) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden",
          RATIO[effectiveRatio],
          tone === "dark"
            ? "bg-white/6 ring-1 ring-inset ring-rule-dark"
            : "bg-canvas-alt ring-1 ring-inset ring-rule",
          className,
        )}
      >
        {caption ? (
          <p
            className={cn(
              "type-eyebrow absolute bottom-5 left-5 right-5",
              tone === "dark" ? "text-white/45" : "text-ink-muted",
            )}
          >
            {caption}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <figure className={cn("relative w-full", className)}>
      <div className={cn("relative w-full overflow-hidden", RATIO[effectiveRatio])}>
        {/* The image drifts within this frame as it crosses the viewport —
            see ParallaxFrame. The overlay below is a sibling, not a child of
            it, so the tint stays fixed while the photograph moves under it. */}
        <ParallaxFrame>
          {image.video ? (
            // Ambient motion, if this record carries any. Falls back to the
            // still under reduced motion or a metered connection — see
            // AmbientVideo.
            <AmbientVideo
              image={{ ...image, video: image.video }}
              sizes={sizes}
              priority={priority}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover"
              {...(image.blurDataURL
                ? { placeholder: "blur" as const, blurDataURL: image.blurDataURL }
                : {})}
            />
          )}
        </ParallaxFrame>
        {/* Consistent grade across a mismatched library. */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0",
            tone === "dark" ? "bg-ridge/14" : "bg-ridge/8",
          )}
        />
      </div>
      {caption ? (
        <figcaption
          className={cn(
            "type-eyebrow mt-3",
            tone === "dark" ? "text-white/45" : "text-ink-muted",
          )}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
