"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { destroyRemoteVideo } from "@/lib/admin/media-client";
import type { Img, MediaAsset } from "@/lib/schemas";
import { cn } from "@/lib/utils";

/**
 * Browse the Cloudinary-backed media library or upload a new image. Emits
 * the selection as hidden inputs (`${field}.src`, `.alt`, `.ratio`,
 * `.blurDataURL`) matching `imageSchema` exactly, so the parent form's
 * FormData carries an embeddable snapshot — the same shape content/media.ts
 * produced for the old static site. No separate join at read time.
 *
 * `allowVideo` adds a second, optional control beneath the chosen still: an
 * ambient video upload (`${field}.video.mp4`), matching `imageSchema.video`
 * — the same enhancement AmbientVideo already renders elsewhere. It only
 * appears once a still is selected, since the still is always the poster and
 * the schema requires `src` regardless of whether a video is attached.
 */
export function MediaPicker({
  field,
  label,
  initial,
  optional = true,
  allowVideo = false,
}: {
  field: string;
  label: string;
  initial?: Img;
  optional?: boolean;
  allowVideo?: boolean;
}) {
  const [library, setLibrary] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [browsing, setBrowsing] = useState(false);
  const [selected, setSelected] = useState<Img | undefined>(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alt, setAlt] = useState(initial?.alt ?? "");
  const [video, setVideo] = useState<{ mp4?: string; webm?: string } | undefined>(
    initial?.video,
  );
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    if (!browsing || library.length > 0) return;
    setLoading(true);
    fetch("/api/admin/media")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data: MediaAsset[]) => setLibrary(Array.isArray(data) ? data : []))
      .catch(() => setError("Could not load the media library."))
      .finally(() => setLoading(false));
  }, [browsing, library.length]);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("alt", alt);
      const res = await fetch("/api/admin/media", { method: "POST", body });
      if (!res.ok) throw new Error();
      const asset: MediaAsset = await res.json();
      setLibrary((lib) => [asset, ...lib]);
      setSelected({ src: asset.secureUrl, alt: asset.alt, ratio: asset.ratio, blurDataURL: asset.blurDataURL });
      setBrowsing(false);
    } catch {
      setError("Upload failed. Check the file is an image under 4MB.");
    } finally {
      setUploading(false);
    }
  }

  async function handleVideoUpload(file: File) {
    setUploadingVideo(true);
    setVideoError(null);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/admin/hero-video", { method: "POST", body });
      if (!res.ok) throw new Error();
      const { url } = (await res.json()) as { url: string };
      // A video being replaced, not just added — clean up the one it's
      // superseding rather than leaving it orphaned in Cloudinary.
      if (video?.mp4) destroyRemoteVideo(video.mp4);
      setVideo({ mp4: url });
    } catch {
      setVideoError("Upload failed. Check the file is a video under 3MB.");
    } finally {
      setUploadingVideo(false);
    }
  }

  function removeVideo() {
    if (video?.mp4) destroyRemoteVideo(video.mp4);
    setVideo(undefined);
  }

  return (
    <div>
      <span className="type-eyebrow mb-3 block text-ink-muted">{label}</span>

      {selected ? (
        <div className="relative aspect-3/2 w-full max-w-sm overflow-hidden border border-rule">
          <Image src={selected.src} alt={selected.alt} fill sizes="384px" className="object-cover" />
        </div>
      ) : (
        <div className="flex aspect-3/2 w-full max-w-sm items-center justify-center border border-dashed border-rule text-caption text-ink-muted">
          No image selected
        </div>
      )}

      <input type="hidden" name={`${field}.src`} value={selected?.src ?? ""} />
      <input type="hidden" name={`${field}.alt`} value={selected?.alt ?? ""} />
      <input type="hidden" name={`${field}.ratio`} value={selected?.ratio ?? "3:2"} />
      <input type="hidden" name={`${field}.blurDataURL`} value={selected?.blurDataURL ?? ""} />
      {allowVideo && (
        <>
          <input type="hidden" name={`${field}.video.mp4`} value={video?.mp4 ?? ""} />
          <input type="hidden" name={`${field}.video.webm`} value={video?.webm ?? ""} />
        </>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button type="button" variant="secondary" className="px-4 py-2 text-caption" onClick={() => setBrowsing((v) => !v)}>
          {browsing ? "Close library" : "Choose from library"}
        </Button>
        {selected && optional && (
          <Button
            type="button"
            variant="secondary"
            className="px-4 py-2 text-caption"
            onClick={() => {
              setSelected(undefined);
              removeVideo();
            }}
          >
            Remove image
          </Button>
        )}
      </div>

      {allowVideo && selected && (
        <div className="mt-6 max-w-sm border-t border-rule pt-6">
          <span className="type-eyebrow mb-2 block text-ink-muted">
            Ambient video (optional)
          </span>
          <p className="mb-3 text-caption text-ink-muted">
            A short, muted, looping clip that plays over the still above. Keep
            it under ~8 seconds and 3MB — it never blocks the page, and drops
            back to the still under reduced motion or a slow connection.
          </p>

          {video?.mp4 ? (
            <div className="flex flex-wrap items-center gap-3">
              <video
                src={video.mp4}
                muted
                loop
                playsInline
                autoPlay
                className="h-20 w-32 border border-rule object-cover"
              />
              <Button
                type="button"
                variant="secondary"
                className="px-4 py-2 text-caption"
                onClick={removeVideo}
              >
                Remove video
              </Button>
            </div>
          ) : (
            <label className={cn("inline-block", uploadingVideo && "opacity-50")}>
              <span className="type-eyebrow inline-flex cursor-pointer items-center border border-rule px-4 py-2.5 text-ink hover:bg-canvas-alt">
                {uploadingVideo ? "Uploading…" : "Upload video"}
              </span>
              <input
                type="file"
                accept="video/mp4,video/webm"
                className="sr-only"
                disabled={uploadingVideo}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleVideoUpload(file);
                }}
              />
            </label>
          )}
          {videoError && <p className="mt-3 text-caption text-ink">{videoError}</p>}
        </div>
      )}

      {browsing && (
        <div className="mt-4 border border-rule p-4">
          <div className="mb-4 flex flex-wrap items-end gap-3 border-b border-rule pb-4">
            <div className="flex-1">
              <label className="type-eyebrow mb-2 block text-ink-muted" htmlFor={`${field}-alt`}>
                Alt text for a new upload
              </label>
              <input
                id={`${field}-alt`}
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Describe the image for screen readers"
                className="w-full rounded-sm border border-rule bg-canvas px-3 py-2.5 text-body"
              />
            </div>
            <label className={cn("shrink-0", uploading && "opacity-50")}>
              <span className="type-eyebrow inline-flex cursor-pointer items-center border border-rule px-4 py-2.5 text-ink hover:bg-canvas-alt">
                {uploading ? "Uploading…" : "Upload new"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleUpload(file);
                }}
              />
            </label>
          </div>

          {error && <p className="mb-3 text-caption text-ink">{error}</p>}
          {loading && <p className="text-caption text-ink-muted">Loading…</p>}

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {library.map((asset) => (
              <button
                key={asset.publicId}
                type="button"
                onClick={() => {
                  setSelected({
                    src: asset.secureUrl,
                    alt: asset.alt,
                    ratio: asset.ratio,
                    blurDataURL: asset.blurDataURL,
                  });
                  setBrowsing(false);
                }}
                className="relative aspect-square overflow-hidden border border-rule hover:border-green"
              >
                <Image src={asset.secureUrl} alt={asset.alt} fill sizes="120px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
