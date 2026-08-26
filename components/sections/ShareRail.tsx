"use client";

import { useState } from "react";

/**
 * Sticky share rail. Desktop only by placement — on narrow viewports the
 * parent drops it below the article intro rather than pinning a column that
 * does not exist.
 *
 * No share SDKs. LinkedIn and email are plain links; the copy action is six
 * lines of clipboard API with an inline confirmation, because a toast library
 * would be a dependency for one string.
 */
export function ShareRail({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const email = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="lg:sticky lg:top-28">
      <p className="type-eyebrow text-ink-muted">Share</p>
      <ul className="mt-4 space-y-2">
        <li>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw type-eyebrow"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a href={email} className="link-draw type-eyebrow">
            Email
          </a>
        </li>
        <li>
          <button type="button" onClick={copy} className="type-eyebrow">
            <span className="link-draw">Copy link</span>
          </button>
        </li>
      </ul>
      <p
        aria-live="polite"
        className="type-eyebrow mt-3 flex h-4 items-center gap-2 text-green"
      >
        {copied && (
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 animate-pulse-dot rounded-full bg-current"
          />
        )}
        {copied ? "Copied" : ""}
      </p>
    </div>
  );
}
