"use client";

import { useActionState, useState } from "react";
import { TextField, TextAreaField, SelectField } from "@/components/admin/Field";
import { StatusBanner } from "@/components/admin/StatusBanner";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveSocialPostAction } from "@/app/admin/(dashboard)/social/actions";
import type { SocialPost } from "@/lib/schemas";

export function SocialPostForm({ post, order }: { post?: SocialPost; order: number }) {
  const action = saveSocialPostAction.bind(null, post?.id);
  const [state, formAction] = useActionState(action, null);
  const [format, setFormat] = useState<SocialPost["format"]>(post?.format ?? "quote");

  return (
    <form action={formAction} className="space-y-10">
      <StatusBanner state={state} />

      <div className="grid gap-6 sm:grid-cols-3">
        <SelectField
          label="Format"
          name="format"
          value={format}
          onChange={(e) => setFormat(e.target.value as SocialPost["format"])}
        >
          <option value="quote">Quote card</option>
          <option value="stat">Stat card</option>
          <option value="cover">Article cover</option>
        </SelectField>
        <TextField label="Id" name="id" required hint="Unique, stable" defaultValue={post?.id} />
        <TextField label="Position" name="order" type="number" required defaultValue={order} />
      </div>

      {format === "quote" && (
        <>
          <TextAreaField label="Quote" name="quote" required rows={3} defaultValue={post?.format === "quote" ? post.quote : ""} />
          <TextField label="Attribution" name="attribution" required defaultValue={post?.format === "quote" ? post.attribution : ""} />
        </>
      )}

      {format === "stat" && (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField label="Value" name="value" required hint="e.g. 55+" defaultValue={post?.format === "stat" ? post.value : ""} />
            <TextField label="Source" name="source" required defaultValue={post?.format === "stat" ? post.source : ""} />
          </div>
          <TextAreaField label="Label" name="label" required rows={2} defaultValue={post?.format === "stat" ? post.label : ""} />
        </>
      )}

      {format === "cover" && (
        <>
          <TextField label="Kicker" name="kicker" required defaultValue={post?.format === "cover" ? post.kicker : ""} />
          <TextAreaField label="Title" name="title" required rows={2} defaultValue={post?.format === "cover" ? post.title : ""} />
        </>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="LinkedIn permalink" name="href" type="url" required defaultValue={post?.href} />
        <TextField label="Posted" name="postedAt" type="date" required defaultValue={post?.postedAt} />
      </div>

      <div className="border-t border-rule pt-8">
        <SubmitButton>{post ? "Save changes" : "Create post"}</SubmitButton>
      </div>
    </form>
  );
}
