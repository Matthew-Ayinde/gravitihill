"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { UploadProgress } from "@/components/admin/MediaPicker";
import {
  destroyRemoteVideo,
  extractVideoPosterFrame,
  uploadWithProgress,
} from "@/lib/admin/media-client";
import { HOME_HERO_MAX_ITEMS, type Img, type MediaAsset } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // mirrors app/api/admin/media/route.ts
const MAX_VIDEO_BYTES = 3 * 1024 * 1024; // mirrors app/api/admin/hero-video/route.ts

type Pending = { kind: "image" | "video"; previewUrl: string; progress: number; index?: number };

function assetToImg(asset: MediaAsset): Img {
  return { src: asset.secureUrl, alt: asset.alt, ratio: asset.ratio, blurDataURL: asset.blurDataURL };
}

async function uploadImageFile(file: File, onProgress: (percent: number) => void): Promise<MediaAsset> {
  const body = new FormData();
  body.set("file", file);
  body.set("alt", "");
  const { status, data } = await uploadWithProgress("/api/admin/media", body, onProgress);
  if (status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Session expired.");
  }
  if (status < 200 || status >= 300) {
    const payload = data as { message?: string } | null;
    throw new Error(payload?.message ?? "Upload failed.");
  }
  return data as MediaAsset;
}

async function uploadVideoFile(file: File, onProgress: (percent: number) => void): Promise<string> {
  const body = new FormData();
  body.set("file", file);
  const { status, data } = await uploadWithProgress("/api/admin/hero-video", body, onProgress);
  if (status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Session expired.");
  }
  if (status < 200 || status >= 300) {
    const payload = data as { message?: string } | null;
    throw new Error(payload?.message ?? "Upload failed.");
  }
  const { url } = data as { url: string };
  return url;
}

/**
 * Up to five hero slides, edited as a single media grid rather than an
 * add-a-row-then-configure-it flow. Drop or pick an image *or* a video
 * straight onto the trailing tile and it becomes a slide immediately — a
 * video gets its poster frame captured in-browser (see
 * extractVideoPosterFrame), so imageSchema's still-as-poster requirement
 * never surfaces as a separate step. A slide is simply an image or a video;
 * to change which, replace it. Existing slides are thumbnails you replace or
 * remove in place.
 *
 * All state lives here as plain `Img[]`, submitted through the same
 * `items.0`, `items.1`, … hidden inputs lib/admin/form.ts's getImgList
 * already reads — so the server action needed no changes. Comparing that
 * state to `initial` is what drives HeroForm's dirty flag; HeroForm remounts
 * this component (via a key derived from the saved hero) once a save
 * actually lands, so `initial` — and the dirty check — reflect the system's
 * confirmed state rather than an optimistic guess.
 */
export function RepeatableHeroItems({
  initial,
  onDirtyChange,
}: {
  initial: Img[];
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [items, setItems] = useState<Img[]>(initial);
  const [pending, setPending] = useState<Pending | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [browsing, setBrowsing] = useState(false);
  const [library, setLibrary] = useState<MediaAsset[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);

  const dirty = useMemo(() => JSON.stringify(items) !== JSON.stringify(initial), [items, initial]);
  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  useEffect(() => {
    if (!browsing || library.length > 0) return;
    setLibraryLoading(true);
    fetch("/api/admin/media")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data: MediaAsset[]) => setLibrary(Array.isArray(data) ? data : []))
      .catch(() => setError("Could not load the media library."))
      .finally(() => setLibraryLoading(false));
  }, [browsing, library.length]);

  async function addFile(file: File, replaceIndex?: number): Promise<boolean> {
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) {
      setError(`${file.name} isn't an image or video.`);
      return false;
    }
    if (isImage && file.size > MAX_IMAGE_BYTES) {
      setError(`${file.name} is over 4MB.`);
      return false;
    }
    if (isVideo && file.size > MAX_VIDEO_BYTES) {
      setError(`${file.name} is over 3MB — keep clips short.`);
      return false;
    }

    setError(null);
    const previewUrl = URL.createObjectURL(file);
    setPending({ kind: isVideo ? "video" : "image", previewUrl, progress: 0, index: replaceIndex });
    const setProgress = (p: number) =>
      setPending((cur) => (cur ? { ...cur, progress: Math.round(p) } : cur));

    try {
      let next: Img;
      if (isImage) {
        const asset = await uploadImageFile(file, setProgress);
        next = assetToImg(asset);
      } else {
        const posterBlob = await extractVideoPosterFrame(file).catch(() => {
          throw new Error(`Couldn't read a preview frame from ${file.name}. Try a different clip.`);
        });
        const posterFile = new File([posterBlob], "poster.jpg", { type: "image/jpeg" });
        // Poster and video don't depend on each other — upload concurrently
        // rather than back-to-back, which roughly halves wall-clock time.
        let posterProgress = 0;
        let videoProgress = 0;
        const reportCombined = () => setProgress(posterProgress * 0.5 + videoProgress * 0.5);
        const [asset, url] = await Promise.all([
          uploadImageFile(posterFile, (p) => {
            posterProgress = p;
            reportCombined();
          }),
          uploadVideoFile(file, (p) => {
            videoProgress = p;
            reportCombined();
          }),
        ]);
        next = { ...assetToImg(asset), video: { mp4: url } };
      }

      if (replaceIndex !== undefined) {
        const old = items[replaceIndex];
        if (old?.video?.mp4) destroyRemoteVideo(old.video.mp4);
        setItems((list) => list.map((it, i) => (i === replaceIndex ? next : it)));
      } else {
        setItems((list) => [...list, next]);
      }
      setBrowsing(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      return false;
    } finally {
      setPending(null);
      URL.revokeObjectURL(previewUrl);
    }
  }

  async function handleFiles(fileList: File[]) {
    let capacity = HOME_HERO_MAX_ITEMS - items.length;
    for (const file of fileList) {
      if (capacity <= 0) {
        setError("Only 5 slides are allowed — remove one to add more.");
        break;
      }
      if (await addFile(file)) capacity -= 1;
    }
  }

  function removeItem(index: number) {
    const item = items[index];
    if (item?.video?.mp4) destroyRemoteVideo(item.video.mp4);
    setItems((list) => list.filter((_, i) => i !== index));
  }

  function pickFromLibrary(asset: MediaAsset) {
    if (items.length >= HOME_HERO_MAX_ITEMS) return;
    setItems((list) => [...list, assetToImg(asset)]);
    setBrowsing(false);
  }

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <span className="type-eyebrow text-ink-muted">
          Slides ({items.length}/{HOME_HERO_MAX_ITEMS})
        </span>
        <button
          type="button"
          onClick={() => setBrowsing((v) => !v)}
          className="type-eyebrow text-ink-muted hover:text-ink"
        >
          {browsing ? "Close library" : "Choose from library"}
        </button>
      </div>

      <p className="mb-6 max-w-md text-caption text-ink-muted">
        Drop up to five images or short video clips. One slide is a static
        background; two or more crossfade automatically, in the order added.
        A video becomes its own slide — no still needed first.
      </p>

      {items.map((item, i) => (
        <Fragment key={i}>
          <input type="hidden" name={`items.${i}.src`} value={item.src} />
          <input type="hidden" name={`items.${i}.alt`} value={item.alt} />
          <input type="hidden" name={`items.${i}.ratio`} value={item.ratio} />
          <input type="hidden" name={`items.${i}.blurDataURL`} value={item.blurDataURL ?? ""} />
          <input type="hidden" name={`items.${i}.video.mp4`} value={item.video?.mp4 ?? ""} />
          <input type="hidden" name={`items.${i}.video.webm`} value={item.video?.webm ?? ""} />
        </Fragment>
      ))}

      {error && <p className="mb-4 text-caption text-ink">{error}</p>}

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        {items.map((item, i) => (
          <SlideCard
            key={i}
            item={item}
            pending={pending?.index === i ? pending : undefined}
            onReplace={(file) => void addFile(file, i)}
            onRemove={() => removeItem(i)}
          />
        ))}

        {items.length < HOME_HERO_MAX_ITEMS && (
          <AddTile
            pending={pending && pending.index === undefined ? pending : undefined}
            dragActive={dragActive}
            onFiles={(files) => void handleFiles(files)}
            onDragActive={setDragActive}
          />
        )}
      </div>

      {browsing && (
        <div className="mt-6 border border-rule p-4">
          {libraryLoading && <p className="text-caption text-ink-muted">Loading…</p>}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {library.map((asset) => (
              <button
                key={asset.publicId}
                type="button"
                disabled={items.length >= HOME_HERO_MAX_ITEMS}
                onClick={() => pickFromLibrary(asset)}
                className="relative aspect-square overflow-hidden border border-rule hover:border-green disabled:opacity-40"
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

function SlideCard({
  item,
  pending,
  onReplace,
  onRemove,
}: {
  item: Img;
  pending?: Pending;
  onReplace: (file: File) => void;
  onRemove: () => void;
}) {
  return (
    <div>
      <div className="relative aspect-3/2 overflow-hidden border border-rule">
        {pending ? (
          <div className="relative flex h-full items-center justify-center">
            {pending.kind === "video" ? (
              <video
                src={pending.previewUrl}
                muted
                loop
                playsInline
                autoPlay
                className="absolute inset-0 h-full w-full object-cover opacity-40"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pending.previewUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-40"
              />
            )}
            <div className="relative z-10 bg-canvas px-3 py-2">
              <UploadProgress percent={pending.progress} />
            </div>
          </div>
        ) : item.video?.mp4 ? (
          <video
            src={item.video.mp4}
            poster={item.src}
            muted
            loop
            playsInline
            autoPlay
            className="h-full w-full object-cover"
          />
        ) : (
          <Image src={item.src} alt={item.alt} fill sizes="240px" className="object-cover" />
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
        <label className="type-eyebrow cursor-pointer text-ink-muted hover:text-ink">
          Replace
          <input
            type="file"
            accept="image/*,video/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onReplace(file);
              e.target.value = "";
            }}
          />
        </label>
        <span aria-hidden="true" className="text-ink-muted">
          ·
        </span>
        <button type="button" onClick={onRemove} className="type-eyebrow text-ink-muted hover:text-ink">
          Remove
        </button>
      </div>
    </div>
  );
}

function AddTile({
  pending,
  dragActive,
  onFiles,
  onDragActive,
}: {
  pending?: Pending;
  dragActive: boolean;
  onFiles: (files: File[]) => void;
  onDragActive: (active: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "relative flex aspect-3/2 flex-col items-center justify-center gap-1 overflow-hidden border border-dashed border-rule text-center transition-colors",
        dragActive && "border-green bg-canvas-alt",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        onDragActive(true);
      }}
      onDragLeave={() => onDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        onDragActive(false);
        if (e.dataTransfer.files.length) onFiles(Array.from(e.dataTransfer.files));
      }}
    >
      {pending ? (
        <>
          {pending.kind === "video" ? (
            <video
              src={pending.previewUrl}
              muted
              loop
              playsInline
              autoPlay
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pending.previewUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
          )}
          <div className="relative z-10 bg-canvas px-3 py-2">
            <UploadProgress percent={pending.progress} />
          </div>
        </>
      ) : (
        <label className="cursor-pointer px-4">
          <span className="type-eyebrow block text-ink">Add image or video</span>
          <span className="mt-1 block text-caption text-ink-muted">
            Drop a file, or click to browse
          </span>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              if (e.target.files?.length) onFiles(Array.from(e.target.files));
              e.target.value = "";
            }}
          />
        </label>
      )}
    </div>
  );
}
