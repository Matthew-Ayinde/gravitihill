import Image from "next/image";
import type { Img } from "@/lib/schemas";
import { cn } from "@/lib/utils";

/**
 * Images that are always seen whole — never zoomed, never cropped.
 *
 * Insight covers and article figures are often composed artwork (a titled
 * cover, an infographic) where a crop cuts off the message, so these two
 * primitives replace `object-cover` wherever an editor's upload appears.
 */

/** Next 16 deprecates `priority`; above-the-fold images load eagerly at high priority instead. */
function eager(priority: boolean) {
  return priority ? { loading: "eager" as const, fetchPriority: "high" as const } : {};
}

function blurProps(image: Img) {
  return image.blurDataURL
    ? { placeholder: "blur" as const, blurDataURL: image.blurDataURL }
    : {};
}

/**
 * A soft, blurred fill of the image itself, for the space around a contained
 * image — so a frame never shows empty bars. Decorative; fills its parent.
 */
export function ImageBackdrop({
  image,
  sizes,
  priority = false,
  className,
}: {
  image: Img;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("absolute inset-0 overflow-hidden", className)}>
      <Image
        src={image.src}
        alt=""
        fill
        sizes={sizes}
        {...eager(priority)}
        className="scale-110 object-cover opacity-70 blur-2xl saturate-75"
      />
    </div>
  );
}

/**
 * Fills a fixed frame (its parent must be positioned and sized) with the
 * whole image, contained in the centre over an <ImageBackdrop>. Same src and
 * sizes for both layers, so the browser fetches the file once.
 *
 *  renders the contained image alone, for a caller that
 * places the backdrop inside a motion layer of its own — a pan or a zoom can
 * then play on the fill while the image itself stays whole and still.
 */
export function FitImage({
  image,
  sizes,
  priority = false,
  alt,
  backdrop = true,
  className,
}: {
  image: Img;
  sizes: string;
  priority?: boolean;
  /** Overrides image.alt — pass "" where the surrounding link already names it. */
  alt?: string;
  backdrop?: boolean;
  className?: string;
}) {
  return (
    <>
      {backdrop && <ImageBackdrop image={image} sizes={sizes} priority={priority} />}
      <Image
        src={image.src}
        alt={alt ?? image.alt}
        fill
        sizes={sizes}
        {...eager(priority)}
        className={cn("object-contain", className)}
        {...blurProps(image)}
      />
    </>
  );
}

/**
 * Renders the image at its own proportions: as wide as its column, as tall as
 * the picture needs. Images saved before dimensions were recorded fall back to
 * their 3:2 / 4:5 frame, still shown whole via <FitImage>.
 */
export function NaturalImage({
  image,
  sizes,
  priority = false,
  alt,
  className,
}: {
  image: Img;
  sizes: string;
  priority?: boolean;
  alt?: string;
  className?: string;
}) {
  if (image.width && image.height) {
    return (
      <Image
        src={image.src}
        alt={alt ?? image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        {...eager(priority)}
        className={cn("block h-auto w-full", className)}
        {...blurProps(image)}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-canvas-alt",
        image.ratio === "4:5" ? "aspect-4/5" : "aspect-3/2",
        className,
      )}
    >
      <FitImage image={image} sizes={sizes} priority={priority} alt={alt} />
    </div>
  );
}
