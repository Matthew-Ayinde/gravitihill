import { SITE } from "@/lib/site";
import { getSiteSettings } from "@/lib/settings";
import type { Insight, Person, Practice } from "@/lib/schemas";

/**
 * Typed JSON-LD builders. Every structured-data block on the site comes from
 * here, so the NAP in schema can never disagree with the NAP in the footer —
 * both read lib/settings.ts, which is itself backed by the same `settings`
 * document the footer and /contact read.
 */

type Node = Record<string, unknown>;

const ORG_ID = `${SITE.url}/#organization`;

/** Organization + ProfessionalService, emitted once sitewide from the layout. */
export async function organizationJsonLd(): Promise<Node> {
  const settings = await getSiteSettings();
  const postalAddress: Node = {
    "@type": "PostalAddress",
    streetAddress: settings.address.street,
    addressLocality: settings.address.locality,
    addressRegion: settings.address.region,
    addressCountry: settings.address.countryCode,
  };

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.url,
    description: SITE.description,
    slogan: SITE.positioning,
    foundingDate: SITE.foundingDate,
    email: settings.email,
    telephone: settings.phones.map((phone) => phone.e164),
    address: postalAddress,
    areaServed: [
      { "@type": "Country", name: "Nigeria" },
      { "@type": "Place", name: "West Africa" },
    ],
    knowsAbout: [
      "Brand Development",
      "Business Advisory",
      "Executive Coaching",
      "Market Expansion",
    ],
    sameAs: [settings.linkedin],
  };
}

/** WebSite with SearchAction — home only. */
export function webSiteJsonLd(): Node {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/insights?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function personJsonLd(person: Person): Node {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE.url}/about#${person.slug}`,
    name: person.name,
    jobTitle: person.role,
    description: person.bio[0],
    worksFor: { "@id": ORG_ID },
    ...(person.linkedin ? { sameAs: [person.linkedin] } : {}),
  };
}

export function serviceJsonLd(practice: Practice): Node {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE.url}/services/${practice.slug}#service`,
    name: practice.name,
    description: practice.proposition,
    serviceType: practice.name,
    provider: { "@id": ORG_ID },
    areaServed: [
      { "@type": "Country", name: "Nigeria" },
      { "@type": "Place", name: "West Africa" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${practice.name} services`,
      itemListElement: practice.offerings.map((offering) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: offering.name,
          description: offering.note,
        },
      })),
    },
  };
}

export function articleJsonLd(insight: Insight): Node {
  const url = `${SITE.url}/insights/${insight.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: insight.title,
    description: insight.excerpt,
    articleSection: insight.category,
    datePublished: insight.publishedAt,
    dateModified: insight.publishedAt,
    author: { "@type": "Organization", name: insight.author, "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(insight.coverImage ? { image: absoluteImageUrl(insight.coverImage.src) } : {}),
  };
}

/** Cloudinary URLs are already absolute; only relative `/public` paths need the site origin prefixed. */
function absoluteImageUrl(src: string): string {
  return /^https?:\/\//.test(src) ? src : `${SITE.url}${src}`;
}

export function breadcrumbJsonLd(
  trail: ReadonlyArray<{ name: string; path: string }>,
): Node {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${SITE.url}${crumb.path}`,
    })),
  };
}
