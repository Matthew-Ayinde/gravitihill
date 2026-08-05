import { ImageResponse } from "next/og";

/**
 * Shared OpenGraph image renderer.
 *
 * Every route's `opengraph-image.tsx` calls this, so a share card is composed
 * from the same system as the site: --ridge ground, the approved white
 * wordmark lockup, display-set type, one --accent rule. Nothing is decorative.
 *
 * ── On the typeface ─────────────────────────────────────────────────────────
 * ImageResponse needs real font bytes; it cannot read the next/font pipeline.
 * Archivo is fetched from Google's static host at generation time and cached by
 * the build. If that fetch fails — offline CI, a blocked egress rule — the card
 * still renders in the runtime's default face rather than failing the build.
 * The layout is identical either way.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const RIDGE = "#0D2A0B";
const WHITE = "#FFFFFF";
const ACCENT = "#8ABF4D";

let fontCache: ArrayBuffer | null | undefined;

async function archivoBold(): Promise<ArrayBuffer | null> {
  if (fontCache !== undefined) return fontCache;

  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Archivo:wght@700&display=swap",
      {
        headers: {
          // Google serves woff2 to modern UA strings; satori needs ttf.
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/533.20.25",
        },
      },
    ).then((response) => response.text());

    const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
    if (!url) {
      fontCache = null;
      return null;
    }

    const data = await fetch(url).then((response) => response.arrayBuffer());
    fontCache = data;
    return data;
  } catch {
    fontCache = null;
    return null;
  }
}

export async function ogImage({
  eyebrow,
  title,
  footnote = "Lagos, Nigeria",
}: {
  eyebrow: string;
  title: string;
  footnote?: string;
}) {
  const font = await archivoBold();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: RIDGE,
          padding: "72px 80px",
          fontFamily: font ? "Archivo" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              color: WHITE,
              fontSize: 26,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Graviti Hill
          </div>
          <div
            style={{
              color: ACCENT,
              fontSize: 22,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: 96, height: 3, background: ACCENT }} />
          <div
            style={{
              marginTop: 36,
              color: WHITE,
              fontSize: title.length > 60 ? 64 : 82,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              fontWeight: 700,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "rgba(255,255,255,0.55)",
            fontSize: 22,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <span>{footnote}</span>
          <span>gravitihill.com</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      ...(font
        ? { fonts: [{ name: "Archivo", data: font, style: "normal", weight: 700 as const }] }
        : {}),
    },
  );
}
