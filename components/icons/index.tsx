import type { IconName } from "@/lib/schemas";
import { cn } from "@/lib/utils";

/**
 * FILLED DUOTONE ICON SET
 *
 * Solid --green base with --accent as the secondary fill. No strokes, no
 * outlines, two fills maximum, 24px grid throughout.
 *
 * No icon library is imported. Lucide, Heroicons and the rest are stroke sets;
 * their hairline geometry reads as a different brand entirely next to this
 * type. These are hand-built so the weight matches the display face.
 *
 * The base group inherits `currentColor`, so an icon takes its primary fill
 * from whatever colour its container sets. The accent group re-scopes
 * `currentColor` via `accentClassName`: one class, no fill props to thread.
 */

export type IconProps = {
  className?: string;
  /** Overrides the secondary fill. Defaults to --accent. */
  accentClassName?: string;
  /** Supply on standalone icons; omit when adjacent text already names it. */
  title?: string;
};

function Svg({
  className,
  title,
  children,
}: {
  className?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-6 w-6 shrink-0", className)}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

function Accent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <g className={className ?? "text-accent"} fill="currentColor">
      {children}
    </g>
  );
}

/* ── The set ─────────────────────────────────────────────────────────────── */

export const StrategyIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <path d="M3 20V4h2.6v13.4H19V20H3Z" />
      <path d="M7.6 15.4 12 9.2l3 3.4 4.4-6.2 2.1 1.5-6.3 8.9-3-3.4-2.5 3.5-2.1-1.5Z" />
    </g>
    <Accent className={accentClassName}>
      <circle cx="19.6" cy="6.6" r="2.4" />
    </Accent>
  </Svg>
);

export const BrandBuildingIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <rect x="3" y="10" width="6" height="11" />
      <rect x="10.5" y="3" width="6" height="18" />
    </g>
    <Accent className={accentClassName}>
      <rect x="18" y="14" width="3" height="7" />
    </Accent>
  </Svg>
);

export const GrowthIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <rect x="3" y="14" width="4.5" height="7" />
      <rect x="9.75" y="9.5" width="4.5" height="11.5" />
    </g>
    <Accent className={accentClassName}>
      <rect x="16.5" y="3" width="4.5" height="18" />
    </Accent>
  </Svg>
);

export const InsightsIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <path d="M11 3.1v9.9h9.9A10 10 0 1 1 11 3.1Z" />
    </g>
    <Accent className={accentClassName}>
      <path d="M13 2.05A10 10 0 0 1 21.95 11H13V2.05Z" />
    </Accent>
  </Svg>
);

export const DiagnosisIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 3.4a6.6 6.6 0 1 1 0 13.2 6.6 6.6 0 0 1 0-13.2Z" />
    </g>
    <Accent className={accentClassName}>
      <circle cx="12" cy="12" r="3.2" />
    </Accent>
  </Svg>
);

export const ExecutionIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <path d="M3 3h18v18H3V3Zm3.2 3.2v11.6h11.6V6.2H6.2Z" />
    </g>
    <Accent className={accentClassName}>
      <path d="M9.6 8.4 16.2 12l-6.6 3.6V8.4Z" />
    </Accent>
  </Svg>
);

export const PeopleCultureIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <circle cx="8.5" cy="7.5" r="3.5" />
      <path d="M2 21a6.5 6.5 0 0 1 13 0v.5H2V21Z" />
    </g>
    <Accent className={accentClassName}>
      <circle cx="17" cy="8.5" r="2.8" />
      <path d="M12.6 21a4.9 4.9 0 0 1 9.4-2v2.5h-9.4V21Z" />
    </Accent>
  </Svg>
);

export const LeadershipIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <rect x="2" y="14" width="6" height="7" />
      <rect x="16" y="11" width="6" height="10" />
    </g>
    <Accent className={accentClassName}>
      <rect x="9" y="6" width="6" height="15" />
    </Accent>
  </Svg>
);

export const GovernanceIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <rect x="4" y="10" width="3" height="8" />
      <rect x="10.5" y="10" width="3" height="8" />
      <rect x="17" y="10" width="3" height="8" />
      <rect x="2" y="19.5" width="20" height="2.5" />
    </g>
    <Accent className={accentClassName}>
      <path d="M12 2 22 8H2l10-6Z" />
    </Accent>
  </Svg>
);

export const MarketExpansionIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM4.6 10.4h14.8a7.6 7.6 0 0 1 0 3.2H4.6a7.6 7.6 0 0 1 0-3.2Z" />
    </g>
    <Accent className={accentClassName}>
      <path d="M15.4 6.6 21.5 12l-6.1 5.4v-3.6h-4v-3.6h4V6.6Z" />
    </Accent>
  </Svg>
);

export const ProcessOptimisationIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <rect x="2" y="9" width="6" height="6" />
      <rect x="16" y="9" width="6" height="6" />
      <rect x="8" y="11.25" width="2" height="1.5" />
      <rect x="14" y="11.25" width="2" height="1.5" />
    </g>
    <Accent className={accentClassName}>
      <rect x="9" y="4" width="6" height="6" />
      <rect x="9" y="14" width="6" height="6" />
    </Accent>
  </Svg>
);

export const CustomerExperienceIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <path d="M3 3h18v13H8.5L3 21V3Z" />
    </g>
    <Accent className={accentClassName}>
      <circle cx="8" cy="9.5" r="1.8" />
      <circle cx="12" cy="9.5" r="1.8" />
      <circle cx="16" cy="9.5" r="1.8" />
    </Accent>
  </Svg>
);

export const InnovationIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <path d="M12 2 21.5 7.25v9.5L12 22l-9.5-5.25v-9.5L12 2Z" />
    </g>
    <Accent className={accentClassName}>
      <path d="M12 7.4 16.6 12 12 16.6 7.4 12 12 7.4Z" />
    </Accent>
  </Svg>
);

export const ValueChainIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <path d="M2 6h5.5l4 6-4 6H2l4-6-4-6Z" />
      <path d="M8.5 6H14l4 6-4 6H8.5l4-6-4-6Z" />
    </g>
    <Accent className={accentClassName}>
      <path d="M15 6h5.5l4 6-4 6H15l4-6-4-6Z" />
    </Accent>
  </Svg>
);

export const ExecutiveCoachingIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <rect x="3" y="10.5" width="18" height="3.5" rx="1.75" />
    </g>
    <Accent className={accentClassName}>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="12" cy="4.6" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <circle cx="7.5" cy="18.6" r="2.2" />
      <circle cx="16.5" cy="18.6" r="2.2" />
    </Accent>
  </Svg>
);

export const OrganisationalDesignIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <rect x="2" y="16" width="5.5" height="5.5" />
      <rect x="9.25" y="16" width="5.5" height="5.5" />
      <rect x="16.5" y="16" width="5.5" height="5.5" />
      <rect x="11.25" y="9" width="1.5" height="5" />
      <rect x="4.25" y="12.5" width="15.5" height="1.5" />
      <rect x="4.25" y="12.5" width="1.5" height="4" />
      <rect x="18.25" y="12.5" width="1.5" height="4" />
    </g>
    <Accent className={accentClassName}>
      <rect x="9.25" y="2.5" width="5.5" height="5.5" />
    </Accent>
  </Svg>
);

export const PerformanceIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <path d="M12 4a10 10 0 0 1 10 10v2.5h-3.6V14a6.4 6.4 0 0 0-12.8 0v2.5H2V14A10 10 0 0 1 12 4Z" />
    </g>
    <Accent className={accentClassName}>
      <path d="M17.2 8.4 12.3 15a1.9 1.9 0 1 1-2.4-2.9l7.3-3.7Z" />
    </Accent>
  </Svg>
);

export const ResearchIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <path d="M10.5 2a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm0 3.4a5.1 5.1 0 1 1 0 10.2 5.1 5.1 0 0 1 0-10.2Z" />
    </g>
    <Accent className={accentClassName}>
      <path d="m16.3 16.3 2.4-2.4L22.5 17.7a1.7 1.7 0 0 1-2.4 2.4L16.3 16.3Z" />
    </Accent>
  </Svg>
);

export const StakeholderEngagementIcon = ({ className, accentClassName, title }: IconProps) => (
  <Svg className={className} title={title}>
    <g fill="currentColor">
      <circle cx="12" cy="4.6" r="2.6" />
      <circle cx="4.6" cy="16" r="2.6" />
      <circle cx="19.4" cy="16" r="2.6" />
      <path d="M11.3 7.2h1.4v5.2h-1.4zM6.6 13.9l4.1-2.4.7 1.2-4.1 2.4zM12.6 12.7l.7-1.2 4.1 2.4-.7 1.2z" />
    </g>
    <Accent className={accentClassName}>
      <circle cx="12" cy="19.4" r="2.6" />
    </Accent>
  </Svg>
);

/* ── Registry ────────────────────────────────────────────────────────────── */

export const ICONS: Record<IconName, (p: IconProps) => React.JSX.Element> = {
  strategy: StrategyIcon,
  "brand-building": BrandBuildingIcon,
  growth: GrowthIcon,
  insights: InsightsIcon,
  diagnosis: DiagnosisIcon,
  execution: ExecutionIcon,
  "people-culture": PeopleCultureIcon,
  leadership: LeadershipIcon,
  governance: GovernanceIcon,
  "market-expansion": MarketExpansionIcon,
  "process-optimisation": ProcessOptimisationIcon,
  "customer-experience": CustomerExperienceIcon,
  innovation: InnovationIcon,
  "value-chain": ValueChainIcon,
  "executive-coaching": ExecutiveCoachingIcon,
  "organisational-design": OrganisationalDesignIcon,
  performance: PerformanceIcon,
  research: ResearchIcon,
  "stakeholder-engagement": StakeholderEngagementIcon,
};

/** Renders an icon by its schema name. Used wherever content carries a key. */
export function Icon({ name, ...props }: IconProps & { name: IconName }) {
  const Component = ICONS[name];
  return <Component {...props} />;
}
