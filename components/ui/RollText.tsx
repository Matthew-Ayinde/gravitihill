import { cn } from "@/lib/utils";

/**
 * A single line that rolls over to a green copy of itself when its link is
 * hovered or focused. Pure CSS (see the INSIGHTS block in globals.css), so it
 * works before hydration and costs nothing per frame.
 *
 * The whole line moves as one — never letter by letter. The second copy is
 * aria-hidden, so the link's accessible name is the text exactly once.
 * Keep the value short: the line does not wrap.
 */
export function RollText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn("roll", className)}>
      <span className="roll-track">
        <span className="roll-line">{children}</span>
        <span aria-hidden="true" className="roll-line roll-alt">
          {children}
        </span>
      </span>
    </span>
  );
}
