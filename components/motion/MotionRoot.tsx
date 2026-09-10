"use client";

import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";
import { SmoothScroll } from "./SmoothScroll";

/**
 * The site's single motion root.
 *
 * GSAP needs no context provider (the pre-port version existed to host
 * framer-motion's LazyMotion), but it does need one thing at the app level
 * that no individual component can do for itself: a ScrollTrigger.refresh()
 * after every client-side route change.
 *
 * Why that matters: ScrollTrigger caches every trigger's start/end pixel
 * positions at creation. On an App Router navigation the new page's triggers
 * are created against a document whose height is still the *old* page's — so
 * without a refresh, reveals on the new route fire at the wrong scroll
 * position, or never fire at all because their start is already behind the
 * viewport. This is the single most common way a GSAP site "breaks on the
 * second page" and it is invisible on a hard reload, which is exactly how it
 * survives to production.
 *
 * The refresh is deferred a frame so it measures after the new route has
 * painted and after any images with reserved boxes have settled.
 *
 * Per-component cleanup is not handled here — every animated component scopes
 * its own tweens with useGSAP, which reverts them on unmount. That contract is
 * enforced by convention: no component on this site creates a ScrollTrigger
 * outside a useGSAP scope.
 *
 * `children` stays a server-rendered tree; this only wraps it.
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Release the pre-hydration hold stamped by the root layout's inline script
  // (see <Entrance>). Layout effects run child-first, so by now every entrance
  // below has taken over its own elements and nothing flashes.
  useLayoutEffect(() => {
    document.documentElement.removeAttribute("data-motion-boot");
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <>
      <SmoothScroll />
      {children}
    </>
  );
}
