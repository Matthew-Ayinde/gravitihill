"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Share actions for the end of an article.
 *
 * No share SDKs: LinkedIn and email are plain links, and copying is the
 * clipboard API. On copy, the label rolls up to its confirmation and back
 * (CSS, see .share-copy in globals.css); the confirmation is also announced
 * through a live region, since a label swap alone is not reliably read.
 */
export function ShareActions({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const email = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <p className="type-eyebrow text-ink-muted">Pass it on</p>
      <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <li>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw type-eyebrow text-ink"
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a href={email} className="link-draw type-eyebrow text-ink">
            Email
          </a>
        </li>
        <li>
          <button
            type="button"
            onClick={copy}
            data-copied={copied || undefined}
            className="share-copy type-eyebrow text-ink"
          >
            <span className="share-copy-track">
              <span className="share-copy-line">Copy link</span>
              <span aria-hidden="true" className="share-copy-line text-green">
                Link copied
              </span>
            </span>
          </button>
        </li>
      </ul>
      <p className="sr-only" aria-live="polite">
        {copied ? "Link copied to clipboard." : ""}
      </p>
    </div>
  );
}
