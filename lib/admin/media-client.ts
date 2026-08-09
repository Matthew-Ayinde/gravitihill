/**
 * Client-side helper shared by MediaPicker and RepeatableHeroItems: fires
 * the DELETE on /api/admin/hero-video for a clip that's being detached
 * (removed, replaced, or its slide deleted). Fire-and-forget — a failed
 * cleanup call leaves an orphaned Cloudinary asset, which costs storage but
 * never breaks the page, so it isn't worth blocking or surfacing an error
 * for what is, from the admin's point of view, already a completed removal
 * in the form.
 */
export function destroyRemoteVideo(url: string): void {
  fetch("/api/admin/hero-video", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  }).catch(() => {});
}
