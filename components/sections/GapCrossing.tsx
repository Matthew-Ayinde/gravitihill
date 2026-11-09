/**
 * /about §01 — the gap, drawn.
 *
 * Two cliff faces with open space between them, read as an argument:
 * GROWTH AMBITION stands on the near side, BUSINESS CAPABILITY on the far
 * side, and the void between them is measured and named — THE GAP — with a
 * hairline dimension line, the way a surveyor's drawing would mark it. One
 * dashed arc leaves the near lip, spans the void and lands on the far lip: the section's eyebrow, "the gap we are built to
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

/* The two lips, where the route departs and lands. */
const LIP_L = { x: 468, y: 550 };
const LIP_R = { x: 980, y: 551 };

/*
 * The route: one clean parabolic arc, lip to lip — a single quadratic whose
 * control point sits centred over the void. Its crown peaks ~100 units above
 * the lips: enough lift to read as a span, low enough that it stays a bridge
 * rather than a leap.
 */
const ROUTE = `M${LIP_L.x} ${LIP_L.y} Q724 350 ${LIP_R.x} ${LIP_R.y}`;

/* The dimension line across the void, lip to lip, set just below them. */
const MEASURE_Y = 626;

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
  "type-display absolute bottom-[57.5%] text-body-lg leading-[1.05] text-ink-display lg:text-h3 lg:leading-[1.05]";

export function GapCrossing({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`relative ${className ?? ""}`}>
      <svg focusable="false" viewBox="0 250 1448 650" className="gap-figure block h-auto w-full">
        <defs>
          <mask id="gap-route-mask" maskUnits="userSpaceOnUse">
            <path
              d={ROUTE}
              pathLength={1}
              fill="none"
              stroke="white"
              strokeWidth={16}
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
          <path d={`M${LIP_L.x} ${MEASURE_Y} H${LIP_R.x}`} />
          <path d={`M${LIP_L.x} ${MEASURE_Y - 16} V${MEASURE_Y + 16}`} />
          <path d={`M${LIP_R.x} ${MEASURE_Y - 16} V${MEASURE_Y + 16}`} />
        </g>

        <g mask="url(#gap-route-mask)">
          <path
            d={ROUTE}
            fill="none"
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray="20 16"
            className="stroke-green"
          />
        </g>

        {/* Departure in --green; the --accent traveller rides the arc from
            lip to lip with the dashes trailing behind it, and comes to rest
            on the far side as the landing point. It sits at the origin and
            is carried by `offset-path` along the very same ROUTE string, so
            the dot can never drift off the line it is drawing. */}
        <circle cx={LIP_L.x} cy={LIP_L.y} r={9} className="gap-depart fill-green" />
        <circle
          r={9}
          className="gap-traveller fill-accent"
          style={{ offsetPath: `path("${ROUTE}")` }}
        />
      </svg>

      <p className={`${LABEL} gap-label-near left-[1%]`}>
        Growth
        <br />
        ambition
      </p>

      <p className="gap-label-gap type-display absolute left-1/2 top-[60%] -translate-x-1/2 whitespace-nowrap text-h3 text-green lg:text-h2">
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
