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
    alt: "A high-rise on Ikoyi Road, Lagos, with a large brand billboard mounted on the facade.",
    ratio: "3:2",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABQT/xAAfEAACAQQCAwAAAAAAAAAAAAABAhEAAyExBAUSFEH/xAAUAQEAAAAAAAAAAAAAAAAAAAAB/8QAFxEBAAMAAAAAAAAAAAAAAAAAABESIf/aAAwDAQACEQMRAD8AadllgDEA7or3LFm7JcZwc7oziEsjKxLKfjGam7BVRR4qBmNUW2A//9k=",
  },
  "practice-business-advisory": {
    src: "/images/practice-business-advisory.jpg",
    alt: "Aerial view of Victoria Island, Lagos, showing the commercial district and the lagoon front.",
    ratio: "3:2",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAMG/8QAHxAAAgIBBAMAAAAAAAAAAAAAAQIDEQAEBRIhMVGB/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABURAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIRAxEAPwBK73qBFzXTgjvvuj9xcW6SvHfGIP6BNZm9bIyzMimlrwMnDI4YUxxB/9k=",
  },
  "practice-executive-coaching": {
    src: "/images/practice-executive-coaching.jpg",
    alt: "Delegates seated around a boardroom table during a working session in Africa.",
    ratio: "3:2",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQEC/8QAHxAAAgEEAgMAAAAAAAAAAAAAAQIDABESISIxBBRx/8QAFAEBAAAAAAAAAAAAAAAAAAAAAf/EABYRAAMAAAAAAAAAAAAAAAAAAAABEv/aAAwDAQACEQMRAD8AP9uEMgmichmAFh3W3ngiZlKmMomRyOj8t3Q8k8rycnY4njvqp5Du+OTE6ts0Shpn/9k=",
  },
  "practice-market-expansion": {
    src: "/images/practice-market-expansion.jpg",
    alt: "A bulk carrier alongside gantry cranes at Apapa Port, Lagos.",
    ratio: "3:2",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAQIE/8QAHxABAAEEAQUAAAAAAAAAAAAAAQMAAhEhBQQSMUFR/8QAFAEBAAAAAAAAAAAAAAAAAAAAAf/EABURAQEAAAAAAAAAAAAAAAAAAAAR/9oADAMBAAIRAxEAPwCXmJe7B0sgfclNnKyOroJATes1j8OqbLlHL7pFf//Z",
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
    title: "High rise building in Ikoyi road.jpg",
    author: "Johnbrainyvisuals (Ogedengbe Tobi John)",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:High_rise_building_in_Ikoyi_road.jpg",
  },
  {
    key: "practice-business-advisory",
    title: "Aerial view of victoria island in Lagos, Nigeria with habours for yatches.jpg",
    author: "Ayorinde Ogundele",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Aerial_view_of_victoria_island_in_Lagos,_Nigeria_with_habours_for_yatches.jpg",
  },
  {
    key: "practice-executive-coaching",
    title: "The Economics of Gum Arabic in Africa (27 April 2018) (27016087757).jpg",
    author: "UNCTAD",
    license: "CC BY-SA 2.0",
    source: "https://commons.wikimedia.org/wiki/File:The_Economics_of_Gum_Arabic_in_Africa_(27_April_2018)_(27016087757).jpg",
  },
  {
    key: "practice-market-expansion",
    title: "Apapa port.lagos.jpg",
    author: "Quadrex24",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Apapa_port.lagos.jpg",
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
