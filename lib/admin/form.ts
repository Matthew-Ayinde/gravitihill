import type { IconName, Img } from "@/lib/schemas";

/**
 * Shared FormData parsing for admin Server Actions. Repeatable groups in the
 * admin UI (RepeatableStrings, RepeatableIconRows, RepeatableNoteRows,
 * BlockEditor) all submit parallel arrays under one field name per column —
 * these helpers zip them back into the objects lib/schemas.ts expects.
 */

export function str(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

export function optionalStr(formData: FormData, name: string): string | undefined {
  const value = str(formData, name);
  return value || undefined;
}

/** All values for a repeated field, trimmed, empty ones dropped. */
export function getAllTrimmed(formData: FormData, name: string): string[] {
  return formData
    .getAll(name)
    .map((v) => String(v).trim())
    .filter(Boolean);
}

export function zipIconRows(
  formData: FormData,
  field: string,
): { name: string; icon: IconName; note: string }[] {
  const names = formData.getAll(`${field}.name`).map(String);
  const icons = formData.getAll(`${field}.icon`).map(String);
  const notes = formData.getAll(`${field}.note`).map(String);
  return names
    .map((name, i) => ({
      name: name.trim(),
      icon: (icons[i] ?? "") as IconName,
      note: (notes[i] ?? "").trim(),
    }))
    .filter((row) => row.name && row.note);
}

export function zipNoteRows(
  formData: FormData,
  field: string,
): { name: string; note: string }[] {
  const names = formData.getAll(`${field}.name`).map(String);
  const notes = formData.getAll(`${field}.note`).map(String);
  return names
    .map((name, i) => ({ name: name.trim(), note: (notes[i] ?? "").trim() }))
    .filter((row) => row.name && row.note);
}

/** Reads a MediaPicker's hidden inputs back into an `Img`, or undefined if nothing was selected. */
export function getImg(formData: FormData, field: string): Img | undefined {
  const src = str(formData, `${field}.src`);
  if (!src) return undefined;
  const ratio = str(formData, `${field}.ratio`);
  return {
    src,
    alt: str(formData, `${field}.alt`),
    ratio: ratio === "4:5" ? "4:5" : "3:2",
    blurDataURL: optionalStr(formData, `${field}.blurDataURL`),
  };
}
