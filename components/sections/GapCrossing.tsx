/**
 * /about §01 — the gap, drawn.
 *
 * Two cliff faces with open space between them, read as an argument:
 * GROWTH AMBITION stands on the near side, BUSINESS CAPABILITY on the far
 * side, and the void between them is measured and named — THE GAP — with a
 * hairline dimension line, the way a surveyor's drawing would mark it. One
 * dashed route comes in from above, works its switchbacks over the void and
 * lands on the far lip: the section's eyebrow, "the gap we are built to
 * close", made literal.
 *
 * A server component: plain SVG plus three positioned labels, no JS. The
 * labels are HTML, not SVG <text>, so they keep the site's type system and
 * stay legible at 360px where a scaled SVG font would shrink to nothing.
 * Their positions are percentages of the same box the SVG fills, so they stay
 * pinned to the rock at every width.
 *
 * The sequence is CSS (`.gap-*` in globals.css): the near label, the gap and
 * its measure, the route drawing itself, then the far label as the route
 * arrives. Reduced motion renders the finished composition.
 *
 * The labels are aria-hidden with the drawing: the statement this figure
 * replaces lives on as the sr-only h1 in <AboutMission>, and reading three
 * floating phrases aloud after it would only repeat the idea in fragments.
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

/* The dimension line across the void, lip to lip, set just below them. */
const MEASURE_Y = 626;
const LIP_L = 468;
const LIP_R = 980;

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

/* A label standing on the rock: two lines of condensed display type. */
const LABEL =
  "type-display absolute bottom-[39%] text-body-lg leading-[1.05] text-ink-display lg:text-h3 lg:leading-[1.05]";

export function GapCrossing({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`relative ${className ?? ""}`}>
      <svg focusable="false" viewBox="0 -60 1448 960" className="gap-figure block h-auto w-full">
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

        {/* The measure: a hairline with end ticks, lip to lip. */}
        <g className="gap-measure stroke-ink-muted" strokeWidth={2.5} fill="none">
          <path d={`M${LIP_L} ${MEASURE_Y} H${LIP_R}`} />
          <path d={`M${LIP_L} ${MEASURE_Y - 16} V${MEASURE_Y + 16}`} />
          <path d={`M${LIP_R} ${MEASURE_Y - 16} V${MEASURE_Y + 16}`} />
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

      <p className={`${LABEL} gap-label-near left-[1%]`}>
        Growth
        <br />
        ambition
      </p>

      <p className="gap-label-gap type-display absolute left-1/2 top-[73%] -translate-x-1/2 whitespace-nowrap text-h3 text-green lg:text-h2">
        The gap
      </p>

      <p className={`${LABEL} gap-label-far right-[1%] text-right`}>
        Business
        <br />
        capability
      </p>
    </div>
  );
}
