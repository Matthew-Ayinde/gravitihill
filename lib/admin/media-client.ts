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

/**
 * POSTs a FormData body via XMLHttpRequest rather than fetch — fetch has no
 * upload-progress event, so a real percentage (as opposed to a spinner) is
 * only reachable through xhr.upload.onprogress. Used by MediaPicker for both
 * the image and video upload paths.
 */
export function uploadWithProgress(
  url: string,
  body: FormData,
  onProgress: (percent: number) => void,
): Promise<{ status: number; data: unknown }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      let data: unknown = null;
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
      } catch {
        data = null;
      }
      resolve({ status: xhr.status, data });
    };
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(body);
  });
}

/**
 * Grabs a single frame from a video file as a JPEG blob. Lets the hero slide
 * grid treat a dropped video as a complete slide on its own — imageSchema
 * requires a still as the poster, and this is how the admin avoids picking
 * one by hand. Seeks a fraction of a second in rather than reading frame
 * zero, since many encoders leave the very first frame black.
 */
export function extractVideoPosterFrame(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;

    const cleanup = () => {
      video.removeAttribute("src");
      video.load();
      URL.revokeObjectURL(url);
    };
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Timed out reading the video."));
    }, 8000);

    video.addEventListener("loadeddata", () => {
      video.currentTime = Math.min(0.1, (video.duration || 1) / 2);
    });

    video.addEventListener("seeked", () => {
      clearTimeout(timeout);
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx || canvas.width === 0) {
        cleanup();
        reject(new Error("Could not read a frame from that video."));
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          cleanup();
          if (blob) resolve(blob);
          else reject(new Error("Could not encode a poster image."));
        },
        "image/jpeg",
        0.85,
      );
    });

    video.addEventListener("error", () => {
      clearTimeout(timeout);
      cleanup();
      reject(new Error("Could not read that video file."));
    });
  });
}
