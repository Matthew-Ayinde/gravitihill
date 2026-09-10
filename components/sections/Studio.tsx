"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * THE STUDIO — /about's stage
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A lit room for extruded type to stand in: a floor receding to a horizon, a
 * green wedge sitting on it, and one camera shared by everything inside.
 *
 * ── One perspective, one camera ──────────────────────────────────────────
 * Everything in here is a child of a single `perspective-scene`, which is
 * what makes the type, the floor and the wedge look like objects in one room
 * rather than three effects on one page. This is the specific thing a WebGL
 * canvas could not do here: a canvas is its own rendering context with its
 * own camera, so CSS type could never actually stand on a WebGL floor — the
 * two would drift apart at every viewport width.
 *
 * ── Where overflow is allowed to be ──────────────────────────────────────
 * `overflow: hidden` forces `transform-style: preserve-3d` to compute as
 * `flat` — the 3D scene silently collapses. So the clipping lives on the
 * outer <section> (which only carries `perspective`, not `preserve-3d`) and
 * the inner stage, which does carry it, never clips. Getting this backwards
 * is the single easiest way to end up with a flat page and no error message.
 *
 * ── Tiers ────────────────────────────────────────────────────────────────
 * Below 1024px or on a coarse pointer the room is not built at all: no floor
 * plane, no wedge, no listeners. The children render as flat editorial type
 * on a plain surface, which is the right answer on a phone rather than a
 * scaled-down room.
 */
export function Studio({
  children,
  className,
  id,
  labelledBy,
  /** The wedge. One per page — it is a landmark, not a texture. */
  hill = false,
  /** Which wall this room is lit against. */
  surface = "warm",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
  hill?: boolean;
  surface?: "warm" | "deep";
}) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [rich, setRich] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setRich(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const live = rich && !reduced;

  // The room leans fractionally toward the cursor. Capped at 3°: past that it
  // stops reading as a camera and starts reading as a toy, and this page is
  // making an argument.
  useGSAP(
    () => {
      const section = root.current;
      const node = stage.current;
      if (!live || !section || !node) return;

      const settle = { duration: 0.9, ease: "power3" } as const;
      const rotateX = gsap.quickTo(node, "rotateX", settle);
      const rotateY = gsap.quickTo(node, "rotateY", settle);

      const onMove = (event: PointerEvent) => {
        const rect = section.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        rotateX(gsap.utils.interpolate(2, -2, py));
        rotateY(gsap.utils.interpolate(-3, 3, px));
      };
      const onLeave = () => {
        rotateX(0);
        rotateY(0);
      };

      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);
      return () => {
        section.removeEventListener("pointermove", onMove);
        section.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [live], scope: root },
  );

  return (
    <section
      ref={root}
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "perspective-scene relative overflow-hidden py-section",
        surface === "deep" ? "bg-studio-warm-deep" : "bg-studio-warm",
        className,
      )}
    >
      {live && <Floor surface={surface} />}
      {live && hill && <Hill />}

      <div ref={stage} className="preserve-3d relative z-10">
        {children}
      </div>
    </section>
  );
}

/**
 * The floor — a cyclorama, not a plane.
 *
 * The first attempt at this was a literal rotateX(90deg) surface receding to
 * a horizon. It was rejected on sight: at a near head-on camera a rotated
 * plane collapses to almost nothing, so all it actually contributed was two
 * hard horizontal edges cutting across the page. Geometrically honest,
 * visually a stray rectangle.
 *
 * What a photographer's studio actually looks like is a curved backdrop with
 * no seam at all — the wall becomes the floor through a gradient, which is
 * the only thing the eye needs to read "this is a surface receding under the
 * subject". So that is what this is: one long, very soft falloff over the
 * lower half of the section, no edge anywhere.
 *
 * This is the single gradient on the route, and it is a lighting condition
 * rather than decoration — see ABOUT_BRIEF §3 and open question 1.
 */
function Floor({ surface }: { surface: "warm" | "deep" }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-linear-to-b from-transparent",
        surface === "deep" ? "to-canvas-alt" : "to-studio-warm-deep",
      )}
    />
  );
}

/**
 * The wedge — a hill, sitting on the floor at the lower left.
 *
 * Two planes: a lit face and, pushed back in Z, the same silhouette in
 * shadow — enough to read as a solid at this scale and angle. This is the
 * "abstract terrain, never the mark" object the redesign brief called for,
 * built from the same CSS 3D as everything else in the room so it shares the
 * scene's camera instead of fighting it. It is a shape, not the logo: no
 * wave curve, no lockup geometry, nothing derived from the brand mark.
 */
function Hill() {
  return (
    <div
      aria-hidden="true"
      className="preserve-3d pointer-events-none absolute bottom-[11%] left-[3%] h-24 w-44"
    >
      <div className="preserve-3d absolute inset-0 transform-[rotateY(-28deg)]">
        {/* The shaded return, furthest from the light, drawn first. */}
        <div className="absolute inset-0 [clip-path:polygon(0_100%,100%_18%,100%_100%)] bg-ridge transform-[translateZ(-26px)]" />
        {/* The lit face. */}
        <div className="absolute inset-0 [clip-path:polygon(0_100%,100%_18%,100%_100%)] bg-green" />
      </div>
      {/* Its own contact shadow — an object without one floats, and a
          floating object is the fastest way to break a room. */}
      <span className="absolute inset-x-[-14%] -bottom-3 block h-6 rounded-[50%] bg-ridge/22 blur-xl" />
    </div>
  );
}
