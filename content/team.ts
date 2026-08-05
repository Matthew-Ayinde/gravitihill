import { personSchema, type Person } from "@/lib/schemas";
import { z } from "zod";

/**
 * LEADERSHIP.
 *
 * ── CMS seam ────────────────────────────────────────────────────────────────
 * Data layer for the /about leadership index and the Person JSON-LD.
 *
 * `photo` is deliberately absent on every record. PersonCard renders a
 * typographic monogram in its place, so the page is complete and composed
 * before any headshot exists. Adding a photo is a one-line change per person.
 *
 * Facts here are verified. Do not add clients, awards or figures.
 */

const team: Person[] = [
  {
    slug: "ken-onyeali-ikpe",
    name: "Dr. Ken Onyeali Ikpe",
    role: "Chairman & Chief Executive",
    bio: [
      "Ken is the immediate past Group CEO of Insight Redefini Group, a TROYKA company and Sub-Saharan Africa's largest marketing communications and consumer consulting group.",
      "He has spent his career at the point where brand strategy meets economic reality — which is the tension Graviti Hill was built to resolve.",
    ],
    credentials: [
      "PhD, Development Economics",
      "Advanced Management Programme, Lagos Business School",
      "IESE Business School, Barcelona",
    ],
  },
  {
    slug: "bukola-shobowale",
    name: "Bukola Shobowale",
    role: "Partner",
    bio: [
      "Bukola was Head of Business at QuadrantMSL and Business Director at Insight Publicis.",
      "Fifteen years of leading brands to optimal service delivery and brand equity, across categories where the distance between a promise and its delivery decides the outcome.",
    ],
    credentials: [
      "School of Strategy, Harvard Business School",
      "15+ years in brand and business leadership",
    ],
  },
  {
    slug: "tunde-samuel-ipaye",
    name: "Tunde Samuel-Ipaye",
    role: "Partner",
    bio: [
      "Tunde is a senior executive with a management consulting background at Philips Consulting and a period as Group Strategy Director at Insight Redefini.",
      "His work runs across business planning, HR consulting, business transformation and M&A — the structural side of what a strategy actually requires.",
    ],
    credentials: [
      "Warwick Business School",
      "London Business School",
      "Business transformation and M&A",
    ],
  },
];

export const TEAM = z.array(personSchema).parse(team);

/** Verified: leadership carries 55+ years cumulative experience. */
export const CUMULATIVE_YEARS = "55+";
