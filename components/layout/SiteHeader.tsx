"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE_BRAND } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Lockup } from "@/components/ui/Lockup";
import { ButtonLink } from "@/components/ui/Button";
import { Entrance } from "@/components/motion/Entrance";
import { Magnetic } from "@/components/motion/Magnetic";
import { NAV, type NavItem } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Routes whose hero sits on --ridge, so the unscrolled nav must run white. */
const DARK_HERO_ROUTES = ["/the-naked-board"];

const SOLIDIFY_AT = 80;

export function SiteHeader({
  homeHeroHasMedia = false,
  nav = NAV,
}: {
  /** Whether the "/" hero currently has an admin-set background — see app/layout.tsx. */
  homeHeroHasMedia?: boolean;
  /** NAV with live practice and sector names — see `buildNav` in lib/site.ts. */
  nav?: NavItem[];
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  /** href of the top-level item whose dropdown panel is open, if any. */
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduced = useReducedMotion();
  const openItem = nav.find((item) => item.href === openMenu && item.children);

  const onDarkHero =
    DARK_HERO_ROUTES.includes(pathname) || (pathname === "/" && homeHeroHasMedia);
  const solid = scrolled || mobileOpen;
  const light = onDarkHero && !solid;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SOLIDIFY_AT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on navigation.
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Escape closes whichever layer is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMenu(null);
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock the page while the mobile overlay is up.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = useCallback(
    (href: string) =>
      href === "/" ? pathname === "/" : pathname.startsWith(href),
    [pathname],
  );

  // A child link into a section of the page already open (/about#leadership
  // from /about) does not change the pathname, so the effect above never
  // fires. Close the overlay here, then scroll once its page lock is lifted —
  // while <html> is overflow-locked the smooth scroller is paused and would
  // drop the anchor jump.
  const onMobileChild = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      setMobileOpen(false);
      const [path, hash] = href.split("#");
      if (!hash || path !== pathname) return;
      e.preventDefault();
      window.history.replaceState(null, "", href);
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          document
            .getElementById(hash)
            ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }),
        ),
      );
    },
    [pathname, reduced],
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-brand",
        solid ? "bg-canvas border-b border-rule" : "bg-transparent",
      )}
      onMouseLeave={() => setOpenMenu(null)}
    >
      {/* The header persists across routes, so its entrance plays once per
          hard load — as the splash doors part on "/", immediately elsewhere. */}
      <Entrance className="shell flex h-24 items-center justify-between">
        <div data-load className="flex">
          <Lockup variant={light ? "white" : "black"} width={124} priority />
        </div>

        {/* ── Desktop navigation ─────────────────────────────────────────── */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {nav.map((item) =>
              item.children ? (
                <li
                  key={item.href}
                  data-load
                  onMouseEnter={() => setOpenMenu(item.href)}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    aria-expanded={openMenu === item.href}
                    aria-controls="nav-panel"
                    onFocus={() => setOpenMenu(item.href)}
                    className={cn(
                      "type-eyebrow py-2",
                      light ? "text-white" : "text-ink",
                    )}
                  >
                    <NavLabel active={isActive(item.href)} light={light}>
                      {item.label}
                    </NavLabel>
                  </Link>
                </li>
              ) : (
                <li
                  key={item.href}
                  data-load
                  onMouseEnter={() => setOpenMenu(null)}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onFocus={() => setOpenMenu(null)}
                    className={cn(
                      "type-eyebrow py-2",
                      light ? "text-white" : "text-ink",
                    )}
                  >
                    <NavLabel active={isActive(item.href)} light={light}>
                      {item.label}
                    </NavLabel>
                  </Link>
                </li>
              ),
            )}
            <li data-load onMouseEnter={() => setOpenMenu(null)}>
              <Magnetic strength={0.3}>
                <ButtonLink
                  href="/contact"
                  tone={light ? "dark" : "light"}
                  className="px-5 py-3 text-[0.8125rem]"
                >
                  Start a conversation
                </ButtonLink>
              </Magnetic>
            </li>
          </ul>
        </nav>

        {/* ── Mobile trigger: two lines, one morph ───────────────────────── */}
        <button
          type="button"
          data-load
          className="relative h-10 w-10 lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span
            className={cn(
              "absolute left-1/2 block h-px w-6 -translate-x-1/2 transition-transform duration-300 ease-brand",
              light && !mobileOpen ? "bg-white" : "bg-ink",
              mobileOpen ? "top-1/2 rotate-45" : "top-[17px]",
            )}
          />
          <span
            className={cn(
              "absolute left-1/2 block h-px w-6 -translate-x-1/2 transition-transform duration-300 ease-brand",
              light && !mobileOpen ? "bg-white" : "bg-ink",
              mobileOpen ? "top-1/2 -rotate-45" : "top-[23px]",
            )}
          />
        </button>
      </Entrance>

      {/* ── Dropdown panel: one shared surface, content follows the item ── */}
      <div
        id="nav-panel"
        className={cn(
          "border-t border-rule bg-canvas",
          openItem ? "hidden lg:block" : "hidden",
        )}
      >
        {openItem?.children && (
          <div className="shell grid-12 py-10">
            <p className="type-eyebrow col-span-3 text-ink-muted">
              <span className="text-green">
                {String(openItem.children.length).padStart(2, "0")}
              </span>
              <span aria-hidden="true" className="mx-2">
                —
              </span>
              {openItem.panelLabel ?? openItem.label}
            </p>
            <ul
              className={cn(
                "col-span-9 grid gap-x-10",
                openItem.children.length % 3 === 0
                  ? "grid-cols-3"
                  : "grid-cols-2",
              )}
            >
              {openItem.children.map((child, i) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    onClick={() => setOpenMenu(null)}
                    className="group flex items-baseline gap-4 border-t border-rule py-5 transition-colors duration-200 hover:bg-canvas-alt"
                  >
                    <span className="type-eyebrow text-ink-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="type-subhead block text-h3">
                        {child.label}
                      </span>
                      <span className="mt-1 block text-caption text-ink-muted">
                        {child.note}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── Mobile overlay ───────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-0 top-24 z-40 overflow-y-auto bg-canvas lg:hidden"
        >
          <nav aria-label="Primary mobile" className="shell py-10">
            <MobileNavList reduced={reduced}>
              {nav.map((item, i) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="type-display flex items-baseline justify-between border-t border-rule py-5 text-h2"
                  >
                    {item.label}
                    <span className="type-eyebrow text-ink-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </Link>
                  {item.children && (
                    <ul className="mb-2 flex flex-wrap gap-x-5 gap-y-1 pb-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={(e) => onMobileChild(e, child.href)}
                            className="type-eyebrow text-ink-muted link-draw"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </MobileNavList>
            <div className="mt-10 border-t border-rule pt-10">
              <ButtonLink href="/contact" className="w-full">
                Start a conversation
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

/** Nav label with the active-state accent rule beneath it. */
function NavLabel({
  children,
  active,
}: {
  children: React.ReactNode;
  active: boolean;
  light?: boolean;
}) {
  return (
    <span className="group relative inline-block">
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-1.5 left-0 h-px w-full origin-left bg-accent transition-transform duration-200 ease-brand",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
    </span>
  );
}

/**
 * Staggered reveal for the overlay rows.
 *
 * One tween over the whole list rather than a delay computed per row: the
 * overlay mounts and unmounts as a unit, so a single stagger driven from the
 * <ul> is both cheaper and impossible to desynchronise. Skipped entirely
 * under reduced motion.
 */
function MobileNavList({
  children,
  reduced,
}: {
  children: React.ReactNode;
  reduced: boolean;
}) {
  const ref = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>("li", ref.current),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: EASE_BRAND },
      );
    },
    { dependencies: [reduced], scope: ref },
  );

  return <ul ref={ref}>{children}</ul>;
}
