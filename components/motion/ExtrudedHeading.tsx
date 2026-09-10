"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE_3D, SCROLL_START, TOGGLE_ONCE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * EXTRUDED TYPE
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Display type that stands up off the page: each line gains real depth,
 * built from stacked copies of itself receding in Z with their tone stepping
 * toward --ridge, inside the studio's shared perspective.
 *
 * ── The heading is still a heading ───────────────────────────────────────
 * This is the whole reason the effect is built this way rather than in WebGL.
 * The line you can select, search, translate and hear read aloud is a real
 * DOM node; the depth is decoration arranged around it. A three.js
 * TextGeometry version of this page would turn its own argument into
 * geometry — unselectable, uncrawlable, and needing a duplicate hidden
 * heading to be accessible at all.
 *
 * ── The copies are built on the client, deliberately ─────────────────────
 * The server renders one copy of each line. The depth layers are created
 * here, after mount. Sixteen duplicates of the same sentence in the served
 * HTML reads as keyword stuffing to a crawler whether or not they carry
 * aria-hidden, and they would delay the paint of the very element this page
 * is built around. It also makes the entrance honest: the depth does not
 * exist yet, so growing it is not an effect, it is the thing happening.
 *
 * ── Copies carry text, not markup ────────────────────────────────────────
 * A layer is `textContent`, not a clone of the line's children. The silhouette
 * is identical — same glyphs, same font, same box, so the wrap is the same —
 * but a layer is one uniformly toned node rather than a re-run of the line's
 * internal spans. That is both cheaper to paint and more correct: the side
 * wall of a letter is in shadow, so it should be one tone regardless of how
 * the face is coloured.
 *
 * ── Three tiers, not one scaled down ─────────────────────────────────────
 * Full (≥1024px, fine pointer, motion allowed): extrusion + scroll rotation.
 * Flat (narrow or coarse pointer): real text, no layers created at all.
 *   Sixteen stacked text layers per line on a phone GPU is exactly the paint
 *   cost that turns a scroll into a slideshow, and a beautiful flat editorial
 *   page is a better answer than a struggling 3D one.
 * Still (prefers-reduced-motion): flat, final, at first paint.
 */

export type ExtrudedTone = "ink" | "green" | "white";

/** A run of words within a line that carries its own tone. */
export type ExtrudedSegment = { text: string; tone?: ExtrudedTone };

export type ExtrudedLine = {
  /** Plain text for a single-tone line. */
  text?: string;
  /** The tone for `text`. Ignored when `segments` is given. */
  tone?: ExtrudedTone;
  /**
   * A line that changes colour partway through — "It is" in ink, "short of
   * the discipline" in green, on one line. Segments are laid out inline and
   * each is lit on its own ramp, so the depth changes colour where the face
   * does rather than picking one tone for the whole line.
   */
  segments?: ExtrudedSegment[];
};

/**
 * How each tone is lit.
 *
 * `shade` is where the side wall travels as it recedes, and it is not simply
 * "darker" — that was the first version's mistake. A black face cannot have
 * darker sides: --ink is already at the floor, so ramping it toward --ridge
 * produced one unreadable mass where the letterform, its depth and its
 * shadow were all the same value.
 *
 * What actually happens to a black object in a bright studio is bounce: the
 * cyclorama throws light back into the side walls, so they read as graphite
 * against a black face. Hence ink ramps *up* toward --ink-muted while green
 * ramps *down* toward --ridge. The rule is not "get darker", it is "separate
 * from the face", and which direction that runs depends on where the face
 * already sits.
 *
 * `ramp` is how far along that path the deepest layer lands, `sheen` how
 * much the key light lifts the top of the face.
 */
const TONE: Record<
  ExtrudedTone,
  { face: string; shade: string; ramp: number; sheen: number }
> = {
  // --ink-display, not --ink: see the token's note in globals.css. Pure
  // brand black is a reading colour, and at this scale behind sixteen depth
  // layers it stops being emphatic and just becomes hard to read.
  ink: { face: "var(--ink-display)", shade: "var(--ink-muted)", ramp: 58, sheen: 20 },
  green: { face: "var(--green)", shade: "var(--ridge)", ramp: 78, sheen: 24 },
  white: { face: "var(--white)", shade: "var(--green)", ramp: 70, sheen: 8 },
};

/** Hard ceiling. Beyond this the extrusion does not read deeper, it just costs more. */
const MAX_LAYERS = 16;

/** The custom properties `.extrude-face` reads to shade one lit surface. */
function toneVars(tone: ExtrudedTone): React.CSSProperties {
  const { face, shade, sheen } = TONE[tone];
  return {
    color: face,
    "--face-color": face,
    "--face-shade": shade,
    "--face-sheen": `${sheen}%`,
  } as React.CSSProperties;
}

export function ExtrudedHeading({
  lines,
  as: Tag = "h2",
  id,
  className,
  lineClassName,
  layers = MAX_LAYERS,
  /** Depth per layer once fully grown, in the em-relative units of
   *  `.extrude-layer`.
   *
   *  Read together with `turn`: most of the visible depth now comes from the
   *  block's rotation projecting the Z axis across the screen, so this can
   *  sit lower than it would for a square-on block and still read solid. */
  depth = 1.25,
  /** Degrees the block is turned away from the reader, right edge receding. */
  turn = 11,
}: {
  lines: ExtrudedLine[];
  as?: ElementType;
  id?: string;
  className?: string;
  lineClassName?: string;
  layers?: number;
  depth?: number;
  turn?: number;
}) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const [rich, setRich] = useState(false);

  // Width only — deliberately not `pointer: fine`.
  //
  // Depth has nothing to do with what a reader points with, and gating on the
  // primary pointer would have quietly flattened the type for every
  // touchscreen laptop: Windows reports those as `pointer: coarse` even with
  // a mouse attached. The pointer question belongs to the studio's cursor
  // lean, and it is asked there.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setRich(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const live = rich && !reduced;
  const layerCount = Math.min(layers, MAX_LAYERS);

  useGSAP(
    () => {
      if (!live || !root.current) return;

      const lineNodes = gsap.utils.toArray<HTMLElement>("[data-extrude-line]", root.current);
      if (lineNodes.length === 0) return;

      // ── Build the depth ────────────────────────────────────────────────
      const built: HTMLElement[] = [];
      lineNodes.forEach((line) => {
        const face = line.querySelector<HTMLElement>("[data-extrude-face]");
        if (!face) return;

        /**
         * A depth layer is a clone of the face's own markup, re-toned.
         *
         * Cloning rather than copying textContent is what lets a line change
         * colour partway through: the clone carries the same segment spans in
         * the same positions, so each run of words can be lit on its own ramp
         * while the silhouette, the wrapping and the kerning stay identical to
         * the face by construction — they *are* the face's markup.
         */
        const toneLayer = (node: HTMLElement, distance: number) => {
          const segments = node.querySelectorAll<HTMLElement>("[data-tone]");
          const paint = (el: HTMLElement, tone: ExtrudedTone) => {
            const { face: faceColor, shade, ramp } = TONE[tone];
            el.style.color = `color-mix(in oklab, ${faceColor}, ${shade} ${Math.round(
              distance * ramp,
            )}%)`;
          };

          if (segments.length > 0) {
            segments.forEach((segment) =>
              paint(segment, (segment.dataset.tone ?? "ink") as ExtrudedTone),
            );
          } else {
            paint(node, (line.dataset.tone ?? "ink") as ExtrudedTone);
          }
        };

        const cloneFace = () => {
          const clone = face.cloneNode(true) as HTMLElement;
          clone.removeAttribute("data-extrude-face");
          // The face's material gradient must not travel to the layers: a
          // side wall is not a lit surface, and background-clip:text on a
          // dozen clones is paint cost for something no one can see.
          clone.classList.remove("extrude-face");
          clone
            .querySelectorAll<HTMLElement>(".extrude-face")
            .forEach((el) => el.classList.remove("extrude-face"));
          clone.setAttribute("aria-hidden", "true");
          return clone;
        };

        for (let i = 1; i <= layerCount; i += 1) {
          const layer = cloneFace();
          layer.className = "extrude-layer absolute inset-0 block select-none";
          layer.style.setProperty("--layer", String(i));
          // Each step further back travels further from the face along its
          // tone's lighting path. oklab keeps the ramp perceptually even — a
          // plain sRGB mix muddies green as it darkens, which is the
          // difference between a lit side wall and a dirty one.
          toneLayer(layer, i / layerCount);
          line.insertBefore(layer, face);
          built.push(layer);
        }
      });

      // ── Grow it ────────────────────────────────────────────────────────
      // One tween per line over a registered custom property that every one
      // of that line's layers reads — not one tween per layer. Sixteen
      // layers cost one animated value, and the depth ramp stays in CSS.
      const grow = gsap.fromTo(
        lineNodes,
        { "--extrude-depth": 0 },
        {
          "--extrude-depth": depth,
          duration: 0.9,
          stagger: 0.09,
          ease: EASE_3D,
          scrollTrigger: {
            trigger: root.current,
            start: SCROLL_START,
            toggleActions: TOGGLE_ONCE,
          },
          onStart: () => {
            lineNodes.forEach((line) => {
              line.style.willChange = "transform";
            });
          },
          // will-change is a promise to the compositor to keep a layer around.
          // Left on, sixteen of them per line stay promoted for the life of
          // the page; this is the cleanup that keeps the technique cheap.
          onComplete: () => {
            lineNodes.forEach((line) => {
              line.style.willChange = "";
            });
          },
        },
      );

      return () => {
        grow.scrollTrigger?.kill();
        grow.kill();
        built.forEach((layer) => layer.remove());
      };
    },
    { dependencies: [live, layerCount, depth], scope: root },
  );

  return (
    // ── The heading carries its own camera ─────────────────────────────
    // `perspective` only applies to an element's *direct* children, and it
    // stops travelling the moment a descendant is not preserve-3d. The
    // studio's perspective sits four levels up, above two plain grid divs,
    // so it never reached the type: the rotation and the depth were being
    // projected orthographically, which is why an early build looked flat
    // even with every layer correctly in place.
    //
    // Rather than force preserve-3d onto layout containers — which changes
    // how a grid stacks and clips, for the sake of an effect — the heading
    // owns a perspective of its own. The studio still leans the whole block;
    // this just makes the block itself dimensional.
    <div className={cn("perspective-scene", live && "relative")}>
      {/* The resting turn is what makes this read as an object rather than a
          letterform with a shadow behind it. Square to the camera, depth
          projects straight back and the reader sees none of it; turned a few
          degrees, the far end of the line genuinely recedes and each letter
          shows a different amount of its own side wall — the exact cue the
          eye uses to decide something is solid.

          Origin at the left edge so the line pivots from where it starts and
          grows away toward its end, rather than swinging about its middle. */}
      {/* w-fit so the block is as wide as its longest line rather than as
          wide as the column it sits in, keeping the left-edge pivot tied to
          the type itself. */}
      <Tag
        ref={root}
        id={id}
        className={cn("preserve-3d relative", live && "w-fit", className)}
        style={
          live
            ? { transform: `rotateY(${turn}deg)`, transformOrigin: "left center" }
            : undefined
        }
      >
        {lines.map((line, i) => {
          const lineTone = line.tone ?? "ink";
          const { face, shade, sheen } = TONE[lineTone];
          return (
            <span
              key={i}
              data-extrude-line
              data-tone={lineTone}
              className={cn("preserve-3d relative block", lineClassName)}
              style={toneVars(lineTone)}
            >
              {/* The material only applies where depth exists. On the flat
                  tiers the face is a plain solid fill — shading a surface
                  that is not modelled would just be a tinted headline. */}
              <span
                data-extrude-face
                className={cn(
                  "relative block",
                  live && !line.segments && "extrude-face",
                )}
                style={line.segments ? undefined : { color: face }}
              >
                {line.segments
                  ? line.segments.map((segment, s) => (
                      <span
                        key={s}
                        data-tone={segment.tone ?? "ink"}
                        className={cn(live && "extrude-face")}
                        style={toneVars(segment.tone ?? "ink")}
                      >
                        {segment.text}
                      </span>
                    ))
                  : line.text}
              </span>
            </span>
          );
        })}
      </Tag>
    </div>
  );
}
