/**
 * /about §01 — the gap, drawn.
 *
 * Two cliff faces with open space between them, and one dashed route that
 * leaves the left lip, climbs, doubles back on itself over the void and lands
 * on the far side. It is the section's eyebrow made literal: "the gap we are
 * built to close" — the switchbacks are the work, not a straight bridge.
 *
 * A server component: plain SVG, no JS. The route draws itself through a
 * solid mask stroke (a dashed stroke cannot be drawn on with dashoffset — the
 * offset would slide the dashes instead), keyframed in globals.css under
 * `.gap-route`. Reduced motion renders the finished drawing.
 *
 * Purely illustrative: the statement it replaces lives on as the sr-only h1
 * in <AboutMission>, so this whole figure is aria-hidden.
 *
 * Terrain, not the mark — faceted rock in --green and --accent, nothing taken
 * from the logo's wave geometry.
 */

/* Left cliff in viewBox units; the right one is the same rock mirrored. */
const CLIFF =
  "M0 577 L468 550 L420 617 L308 672 L265 765 L152 842 L62 1086 L0 1086 Z";
const FACETS = [
  "M44 594 L62 632 L30 1086 L22 1086 Z",
  "M240 594 L258 766 L186 817 Z",
  "M292 592 L314 580 L308 672 L266 765 Z",
];

/*
 * The route, traced from the brand's own dashed-curve artwork at its native
 * size (start 45,155 → end 1190,1165) and kept whole — the switchbacks are
 * the point. ROUTE_PLACE scales it uniformly and moves it so the tail lands
 * on the right cliff's lip (985,551); stroke and dash are pre-divided by the
 * scale so they render at the weight the cliffs were drawn for.
 */
const ROUTE =
  "M45 155 C90 290 200 470 480 474 " +
  "C620 476 800 360 900 330 " +
  "C980 305 1040 330 1020 385 " +
  "C1005 425 950 450 940 495 " +
  "C930 545 980 575 1040 600 " +
  "C1100 625 1125 690 1115 740 " +
  "C1100 795 1030 805 980 785 " +
  "C920 760 880 700 820 675 " +
  "C760 655 640 680 500 685 " +
  "C360 690 260 700 240 770 " +
  "C225 830 300 885 450 905 " +
  "C640 920 760 960 1190 1165";
const ROUTE_SCALE = 0.58;
const ROUTE_PLACE = `translate(${985 - 1190 * ROUTE_SCALE} ${551 - 1165 * ROUTE_SCALE}) scale(${ROUTE_SCALE})`;

function Cliff() {
  return (
    <g>
      <path d={CLIFF} className="fill-green" />
      {FACETS.map((d) => (
        <path key={d} d={d} className="fill-accent" />
      ))}
    </g>
  );
}

export function GapCrossing({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 -60 1448 960"
      className={className}
    >
      <defs>
        <mask id="gap-route-mask" maskUnits="userSpaceOnUse">
          <path
            d={ROUTE}
            transform={ROUTE_PLACE}
            pathLength={1}
            fill="none"
            stroke="white"
            strokeWidth={28}
            className="gap-route"
          />
        </mask>
      </defs>

      <Cliff />
      <g transform="translate(1448 0) scale(-1 1)">
        <Cliff />
      </g>

      <g mask="url(#gap-route-mask)">
        <path
          d={ROUTE}
          transform={ROUTE_PLACE}
          fill="none"
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray="34 28"
          className="stroke-green"
        />
      </g>

      {/* Where the route lands: the one accent moment on the far side. */}
      <circle cx={985} cy={551} r={9} className="gap-landing fill-accent" />
    </svg>
  );
}
