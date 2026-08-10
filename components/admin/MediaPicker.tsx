"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { destroyRemoteVideo, uploadWithProgress } from "@/lib/admin/media-client";
import type { Img, MediaAsset } from "@/lib/schemas";
import { cn } from "@/lib/utils";

/** A thin determinate bar — the only feedback while an upload's in flight. */
export function UploadProgress({ percent }: { percent: number }) {
  return (
    <div
      className="mt-2 w-full max-w-55"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Upload progress"
    >
      <div className="h-0.5 w-full bg-rule">
        <div
          className="h-full bg-green transition-[width] duration-150 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="mt-1 block text-caption text-ink-muted">{percent}%</span>
    </div>
  );
}

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [alt, setAlt] = useState(initial?.alt ?? "");
  const [video, setVideo] = useState<{ mp4?: string; webm?: string } | undefined>(
    initial?.video,
  );
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [localVideoPreview, setLocalVideoPreview] = useState<string | null>(null);
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
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setUploading(true);
    setUploadProgress(0);
    setError(null);
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("alt", alt);
      const { status, data } = await uploadWithProgress("/api/admin/media", body, setUploadProgress);
      if (status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (status < 200 || status >= 300) {
        const payload = data as { message?: string } | null;
        throw new Error(payload?.message ?? "Upload failed.");
      }
      const asset = data as MediaAsset;
      setLibrary((lib) => [asset, ...lib]);
      setSelected({ src: asset.secureUrl, alt: asset.alt, ratio: asset.ratio, blurDataURL: asset.blurDataURL });
      setBrowsing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
      setLocalPreview(null);
    }
  }

  async function handleVideoUpload(file: File) {
    const objectUrl = URL.createObjectURL(file);
    setLocalVideoPreview(objectUrl);
    setUploadingVideo(true);
    setVideoUploadProgress(0);
    setVideoError(null);
    try {
      const body = new FormData();
      body.set("file", file);
      const { status, data } = await uploadWithProgress(
        "/api/admin/hero-video",
        body,
        setVideoUploadProgress,
      );
      if (status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (status < 200 || status >= 300) {
        const payload = data as { message?: string } | null;
        throw new Error(payload?.message ?? "Upload failed.");
      }
      const { url } = data as { url: string };
      // A video being replaced, not just added — clean up the one it's
      // superseding rather than leaving it orphaned in Cloudinary.
      if (video?.mp4) destroyRemoteVideo(video.mp4);
      setVideo({ mp4: url });
    } catch (err) {
      setVideoError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingVideo(false);
      URL.revokeObjectURL(objectUrl);
      setLocalVideoPreview(null);
    }
  }

  function removeVideo() {
    if (video?.mp4) destroyRemoteVideo(video.mp4);
    setVideo(undefined);
  }

  return (
    <div>
      <span className="type-eyebrow mb-3 block text-ink-muted">{label}</span>

      {localPreview || selected ? (
        <div className="relative aspect-3/2 w-full max-w-sm overflow-hidden border border-rule">
          {localPreview ? (
            // The file just picked, rendered from a local object URL while it
            // uploads — next/image can't optimize a blob: URI, and there's
            // nothing to fetch from Cloudinary yet.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={localPreview} alt="" className="h-full w-full object-cover" />
          ) : (
            <Image src={selected!.src} alt={selected!.alt} fill sizes="384px" className="object-cover" />
          )}
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
            it under ~8 seconds and 3MB, it never blocks the page, and drops
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
          ) : localVideoPreview ? (
            <div className="flex flex-wrap items-center gap-3">
              <video
                src={localVideoPreview}
                muted
                loop
                playsInline
                autoPlay
                className="h-20 w-32 border border-rule object-cover"
              />
              <UploadProgress percent={videoUploadProgress} />
            </div>
          ) : (
            <div className="inline-block">
              <label className="inline-block">
                <span className="type-eyebrow inline-flex cursor-pointer items-center border border-rule px-4 py-2.5 text-ink hover:bg-canvas-alt">
                  Upload video
                </span>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleVideoUpload(file);
                  }}
                />
              </label>
            </div>
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
                onKeyDown={(e) => {
                  // A plain text input inside a <form> submits on Enter by
                  // default — this field is for labeling an upload in
                  // progress, not for saving the whole slide list early.
                  if (e.key === "Enter") e.preventDefault();
                }}
                placeholder="Describe the image for screen readers"
                className="w-full rounded-sm border border-rule bg-canvas px-3 py-2.5 text-body"
              />
            </div>
            <div className="shrink-0">
              <label className={cn("inline-block", uploading && "opacity-50")}>
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
              {uploading && <UploadProgress percent={uploadProgress} />}
            </div>
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
