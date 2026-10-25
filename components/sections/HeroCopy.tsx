"use client";

import { useSyncExternalStore } from "react";
import { TypedHeadline, type Segment } from "@/components/motion/TypedHeadline";
import {
  getHeroSlideServerSnapshot,
  getHeroSlideSnapshot,
  subscribeHeroSlide,
} from "@/lib/hero-slide";
import { cn } from "@/lib/utils";

export type HeroQuote = { text: string; author: string };

/**
 * The hero's foreground copy, kept in step with HeroBackground's rotation:
 * slide 1 carries the headline, slides 2 and 3 each carry a quote
 * (`quotes[0]`, `quotes[1]`). Any slide past those falls back to the
 * headline.
 *
 * All layers share one grid cell, so the block is always as tall as its
 * tallest member and the swap never shifts the page. Only opacity changes.
 * The <h1> stays in the DOM throughout, so the page keeps its one heading
 * and the LCP element is unchanged. Reduced motion never advances the
 * rotation (see HeroBackground), so those readers see only the headline.
 */
export function HeroCopy({
  segments,
  quotes,
  headlineClassName,
}: {
  segments: Segment[];
  quotes: HeroQuote[];
  headlineClassName?: string;
}) {
  const slide = useSyncExternalStore(
    subscribeHeroSlide,
    getHeroSlideSnapshot,
    getHeroSlideServerSnapshot,
  );
  const quoteIndex = slide - 1;
  const activeQuote = quoteIndex >= 0 && quoteIndex < quotes.length ? quoteIndex : -1;

  return (
    <div className="col-span-12 grid lg:col-span-9">
      <div
        className={cn(
          "col-start-1 row-start-1 transition-opacity duration-700 ease-out",
          activeQuote === -1 ? "opacity-100" : "opacity-0",
        )}
      >
        <TypedHeadline className={headlineClassName} segments={segments} />
      </div>

      {quotes.map((quote, i) => (
        <figure
          key={quote.author}
          aria-hidden={activeQuote !== i}
          className={cn(
            "col-start-1 row-start-1 self-end transition-opacity duration-700 ease-out",
            activeQuote === i ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <blockquote className="type-display max-w-[22ch] text-h1 text-white">
            <p>&ldquo;{quote.text}&rdquo;</p>
          </blockquote>
          <figcaption className="type-eyebrow mt-8 text-accent">
            {quote.author}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
