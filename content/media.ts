import { imageSchema, type Img } from "@/lib/schemas";
import { z } from "zod";

/**
 * MEDIA LIBRARY: placeholder photography.
 *
 * ── CMS seam ────────────────────────────────────────────────────────────────
 * Every image slot on the site resolves through this module. Content modules
 * reference entries by key rather than carrying src/blur strings inline, so
 * swapping the whole library is one file.
 *
 * ── Grade ───────────────────────────────────────────────────────────────────
 * All frames are processed identically: resized to 1600x1067 (3:2), saturation
 * 0.42, contrast +7%, a 10% cool-slate overlay, light sharpen. That is what
 * makes images from many photographers read as one commissioned shoot. Re-run
 * the same grade on any replacement.
 *
 * ── LICENSING: READ BEFORE LAUNCH ───────────────────────────────────────────
 * These are Wikimedia Commons files under CC BY-SA / CC BY licences. They are
 * here so the design can be evaluated with real imagery in place, and they are
 * NOT cleared for an enterprise marketing site as-is:
 *
 *   · CC BY-SA is copyleft. Attribution is mandatory, and the share-alike term
 *     is a poor fit for commissioned brand work.
 *   · Several frames show identifiable people who did not consent to appearing
 *     in Graviti Hill marketing.
 *
 * Replace with commissioned or properly licensed stock before launch. Full
 * attribution for each frame is recorded below so the obligation is met while
 * they are in place, and so nothing ships unattributed by accident.
 */

const media = {
  "practice-brand-development": {
    src: "/images/practice-brand-development.jpg",
    alt: "Silhouetted executives in session around a boardroom table, set against a green disc and city towers.",
    ratio: "3:2",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAIF/8QAIhAAAgIBAwQDAAAAAAAAAAAAAQIDBAUAERMSIjFRBiFB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAYEQADAQEAAAAAAAAAAAAAAAAAARICIv/aAAwDAQACEQMRAD8AHnr8lq7IpldoIz2hj9Aa0MLn3x+Ns878pR0EYY7npIPj340T5TSrw2bHHEF6I912/O7U3KsEeNmdIlDGWIE7e1OhM9E5lvR//9k=",
  },
  "practice-business-advisory": {
    src: "/images/practice-business-advisory.jpg",
    alt: "A hand with a pen tracing a printed green bar chart on a desk, glasses beside it.",
    ratio: "3:2",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAALABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAwQFBv/EACAQAAIBBAIDAQAAAAAAAAAAAAECAwAEERIFIRMxQZH/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/EABcRAAMBAAAAAAAAAAAAAAAAAAAREiH/2gAMAwEAAhEDEQA/AJ9haSJesrY8intQM5H0itavKmDj1Bj1eOPJBPf5TS2lvsH8Kb+847oskEMkerxIyj4RRGsqsR//2Q==",
  },
  "practice-executive-coaching": {
    src: "/images/practice-executive-coaching.jpg",
    alt: "Several hands in dark suits holding a white cog together over a boardroom floor.",
    ratio: "3:2",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQEC/8QAIxAAAgECBgIDAAAAAAAAAAAAAQMCBAUAERITIUEGIjFRcf/EABQBAQAAAAAAAAAAAAAAAAAAAAP/xAAZEQADAAMAAAAAAAAAAAAAAAAAAhEBISL/2gAMAwEAAhEDEQA/AJY5uvVAxNe2bVUyydtZ0zZ0Mz3xxnjd2slFTW9L9Qp0wUSYNOucT8cDjPAvi9U9d0gYNkCZZE9kAcD8wlfqlzwqTp6zvyX7AH1+sDltwdV5p//Z",
  },
  "practice-market-expansion": {
    src: "/images/practice-market-expansion.jpg",
    alt: "Two hands meeting in a handshake, overlaid with a city skyline and business people in silhouette.",
    ratio: "3:2",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAgUG/8QAIBAAAgIBBAMBAAAAAAAAAAAAAQIDBAAFERITITFRIv/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAGBEAAwEBAAAAAAAAAAAAAAAAABESIUH/2gAMAwEAAhEDEQA/ANDQ1OVljW1B0lx+XcFQ2C3q8jGVKlYzGMEuyeeIyr1RzpwmRXX4w3wrXhqR9deNY197KPZ+5dpjJXT/2Q==",
  },
  "sector-consumer": {
    src: "/images/sector-consumer.jpg",
    alt: "Traders and shoppers filling the streets of Balogun Market on Lagos Island.",
    ratio: "3:2",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwAE/8QAIBAAAgEEAQUAAAAAAAAAAAAAAQIDAAQRITETIkFCwf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCgvTBID0VBx4JzSSMWjEx7MnZ+1q9+F1xoUFyiusgbLAbAJOqD/9k=",
  },
  "sector-b2b": {
    src: "/images/sector-b2b.jpg",
    alt: "Aerial view of stacked freight containers and gantry cranes at a West African container port.",
    ratio: "3:2",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAEEBf/EAB8QAAICAQQDAAAAAAAAAAAAAAECAxEABBITISJRcf/EABQBAQAAAAAAAAAAAAAAAAAAAAH/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/AJIXk4wVPgAKvq/mE0hk05RyTusBfeYsUjlVtiaFDHNqZuMrvNYjY//Z",
  },
  "sector-technology": {
    src: "/images/sector-technology.jpg",
    alt: "A server aisle inside a data centre, racks running the length of the room.",
    ratio: "3:2",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAECBf/EACEQAAECBgMBAQAAAAAAAAAAAAECIQADBAUREiJBUTKh/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AM+jniXWOkK2Xrh/esQVExM2s+QAVlJDjvD/ALDsiRMvVPuNueX9eKvYEu9VBRx5Zb3AgP/Z",
  },
  "insight-zero-tariff": {
    src: "/images/insight-zero-tariff.jpg",
    alt: "A container vessel berthed at a container terminal, cranes working the deck.",
    ratio: "3:2",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAQME/8QAGxABAAICAwAAAAAAAAAAAAAAAQADAhETQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/EABURAQEAAAAAAAAAAAAAAAAAAAAR/9oADAMBAAIRAxEAPwAxsreyPJX6TMgSSupVD//Z",
  },
  "insight-brand-health": {
    src: "/images/insight-brand-health.jpg",
    alt: "Buses and traffic moving through the commercial streets of Balogun Market, Lagos.",
    ratio: "3:2",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwEF/8QAHxAAAgIDAAIDAAAAAAAAAAAAAQIDEQAEEgUUIUFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAVEQEBAAAAAAAAAAAAAAAAAAABAP/aAAwDAQACEQMRAD8AsG2Io5Z1CGRHAsEm7vGXyCeRlXWnVVodVdXmRqE+nOPrpfjA1gJJk7Abp6Nj9yRlv//Z",
  },
  "insight-transformation": {
    src: "/images/insight-transformation.jpg",
    alt: "The Lekki–Ikoyi Link Bridge in Lagos, cable stays rising over the carriageway.",
    ratio: "3:2",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAwT/xAAfEAACAgIBBQAAAAAAAAAAAAABAgARAwQhBRIyUcH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8ATN1LGTSZQT6BhLuI3k6/ZE4AdKAFizI9wdud645gf//Z",
  },
  "insight-boards": {
    src: "/images/insight-boards.jpg",
    alt: "A wide conference room mid-session, delegates seated at long tables.",
    ratio: "3:2",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAMF/8QAIRAAAgEDAwUAAAAAAAAAAAAAAQIDAAQREhMxBSEiQYH/xAAUAQEAAAAAAAAAAAAAAAAAAAAC/8QAFhEBAQEAAAAAAAAAAAAAAAAAAQAR/9oADAMBAAIRAxEAPwADyvICBL93O+KlAjOdWZiOASfGtgWFst0oEQA5wCaV0eGOWx3nRWk1kasegKBjN0v/2Q==",
  },
} satisfies Record<string, Img>;

export const MEDIA = z.record(z.string(), imageSchema).parse(media) as Record<
  keyof typeof media,
  Img
>;

/**
 * Attribution of record. Rendered nowhere yet — surface it in a /credits route
 * or replace the library before launch.
 */
export const MEDIA_CREDITS = [
  {
    key: "practice-brand-development",
    title: "Client-supplied practice cover",
    author: "Graviti Hill",
    license: "Supplied by client; confirm stock licence before launch",
    source: "",
  },
  {
    key: "practice-business-advisory",
    title: "Client-supplied practice cover",
    author: "Graviti Hill",
    license: "Supplied by client; confirm stock licence before launch",
    source: "",
  },
  {
    key: "practice-executive-coaching",
    title: "Client-supplied practice cover",
    author: "Graviti Hill",
    license: "Supplied by client; confirm stock licence before launch",
    source: "",
  },
  {
    key: "practice-market-expansion",
    title: "Client-supplied practice cover",
    author: "Graviti Hill",
    license: "Supplied by client; confirm stock licence before launch",
    source: "",
  },
  {
    key: "sector-consumer",
    title: "Balogun Market, Lagos Island.jpg",
    author: "Yellowcrunchy",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Balogun_Market,_Lagos_Island.jpg",
  },
  {
    key: "sector-b2b",
    title: "Durban container port (24747434937).jpg",
    author: "Media Club",
    license: "CC BY-SA 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Durban_container_port_(24747434937).jpg",
  },
  {
    key: "sector-technology",
    title: "Virginia Tech - data center.jpg",
    author: "Christopher Bowns",
    license: "CC BY-SA 2.0",
    source: "https://commons.wikimedia.org/wiki/File:Virginia_Tech_-_data_center.jpg",
  },
  {
    key: "insight-zero-tariff",
    title: "Container-Terminal Durban.JPG",
    author: "Pechristener",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Container-Terminal_Durban.JPG",
  },
  {
    key: "insight-brand-health",
    title: "BALOGUN MARKET.jpg",
    author: "Judah Creates",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:BALOGUN_MARKET.jpg",
  },
  {
    key: "insight-transformation",
    title: "Lekki Ikoyi Link Bridge.jpg",
    author: "Chippla",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Lekki_Ikoyi_Link_Bridge.jpg",
  },
  {
    key: "insight-boards",
    title: "The Economics of Gum Arabic in Africa (27 April 2018) (27016086387).jpg",
    author: "UNCTAD",
    license: "CC BY-SA 2.0",
    source: "https://commons.wikimedia.org/wiki/File:The_Economics_of_Gum_Arabic_in_Africa_(27_April_2018)_(27016086387).jpg",
  },
] as const;
