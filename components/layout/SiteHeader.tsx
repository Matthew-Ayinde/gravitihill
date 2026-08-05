"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { Lockup } from "@/components/ui/Lockup";
import { ButtonLink } from "@/components/ui/Button";
import { NAV } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Routes whose hero sits on --ridge, so the unscrolled nav must run white. */
const DARK_HERO_ROUTES = ["/the-naked-board"];

const SOLIDIFY_AT = 80;

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduced = useReducedMotion();
  const servicesRef = useRef<HTMLDivElement>(null);

  const onDarkHero = DARK_HERO_ROUTES.includes(pathname);
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
    setServicesOpen(false);
  }, [pathname]);

  // Escape closes whichever layer is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setServicesOpen(false);
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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-brand",
        solid ? "bg-canvas border-b border-rule" : "bg-transparent",
      )}
      onMouseLeave={() => setServicesOpen(false)}
    >
      <div className="shell flex h-20 items-center justify-between">
        <Lockup variant={light ? "white" : "black"} />

        {/* ── Desktop navigation ─────────────────────────────────────────── */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {NAV.map((item) =>
              item.children ? (
                <li
                  key={item.href}
                  onMouseEnter={() => setServicesOpen(true)}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    aria-expanded={servicesOpen}
                    onFocus={() => setServicesOpen(true)}
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
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
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
            <li>
              <ButtonLink
                href="/contact"
                tone={light ? "dark" : "light"}
                className="px-5 py-3 text-[0.8125rem]"
              >
                Start a conversation
              </ButtonLink>
            </li>
          </ul>
        </nav>

        {/* ── Mobile trigger: two lines, one morph ───────────────────────── */}
        <button
          type="button"
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
      </div>

      {/* ── Services panel ───────────────────────────────────────────────── */}
      <div
        ref={servicesRef}
        className={cn(
          "border-t border-rule bg-canvas",
          servicesOpen ? "hidden lg:block" : "hidden",
        )}
      >
        <div className="shell grid-12 py-10">
          <p className="type-eyebrow col-span-3 text-ink-muted">
            <span className="text-green">04</span>
            <span aria-hidden="true" className="mx-2">
              —
            </span>
            Practices
          </p>
          <ul className="col-span-9 grid grid-cols-2 gap-x-10">
            {NAV.find((n) => n.children)?.children?.map((child, i) => (
              <li key={child.href} className={cn(i > 1 && "mt-px")}>
                <Link
                  href={child.href}
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
      </div>

      {/* ── Mobile overlay ───────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="fixed inset-0 top-20 z-40 overflow-y-auto bg-canvas lg:hidden"
        >
          <nav aria-label="Primary mobile" className="shell py-10">
            <ul>
              {NAV.map((item, i) => (
                <MobileRow key={item.href} index={i} reduced={!!reduced}>
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
                            className="type-eyebrow text-ink-muted link-draw"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </MobileRow>
              ))}
            </ul>
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

/** Staggered reveal for the overlay rows. Skipped entirely under reduced motion. */
function MobileRow({
  children,
  index,
  reduced,
}: {
  children: React.ReactNode;
  index: number;
  reduced: boolean;
}) {
  if (reduced) return <li>{children}</li>;
  return (
    <m.li
      data-motion
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </m.li>
  );
}
