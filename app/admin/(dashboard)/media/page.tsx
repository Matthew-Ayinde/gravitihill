import Image from "next/image";
import type { Metadata } from "next";
import { listMedia } from "@/lib/repositories/media";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { updateAltAction, deleteFromLibraryAction } from "./actions";

export const metadata: Metadata = { title: "Media library", robots: { index: false } };

export default async function AdminMediaPage() {
  const media = await listMedia();

  return (
    <div>
      <p className="type-eyebrow text-green">Content</p>
      <h1 className="type-display mt-3 text-h1">Media library.</h1>
      <p className="mt-3 max-w-md text-caption text-ink-muted">
        Every image lives in Cloudinary with the brand grade applied at
        upload. Upload new assets from any image field elsewhere in the admin
        — this page is for managing what's already here.
      </p>

      <ul className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
        {media.map((asset) => (
          <li key={asset.publicId} className="border border-rule p-3">
            <div className="relative aspect-3/2 w-full overflow-hidden bg-canvas-alt">
              <Image src={asset.secureUrl} alt={asset.alt} fill sizes="240px" className="object-cover" />
            </div>

            <form action={updateAltAction.bind(null, asset.publicId)} className="mt-3 flex gap-2">
              <input
                name="alt"
                defaultValue={asset.alt}
                placeholder="Alt text"
                className="w-full rounded-sm border border-rule bg-canvas px-2 py-1.5 text-caption"
              />
              <button type="submit" className="type-eyebrow shrink-0 border border-rule px-2 text-ink-muted hover:bg-canvas-alt">
                Save
              </button>
            </form>

            {asset.credit && (
              <p className="mt-2 text-caption text-ink-muted/70">{asset.credit.license}</p>
            )}

            <div className="mt-2">
              <DeleteButton
                action={deleteFromLibraryAction.bind(null, asset.publicId)}
                confirmMessage="Remove this from the media library? Content already using it keeps rendering."
                label="Remove from library"
              />
            </div>
          </li>
        ))}
        {media.length === 0 && (
          <li className="col-span-full py-10 text-body-lg text-ink-muted">
            No media yet — upload one from any image field in the admin.
          </li>
        )}
      </ul>
    </div>
  );
}
