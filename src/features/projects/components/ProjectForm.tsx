"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { createProjectAction } from "../actions";
import { uploadCoverImage } from "../uploadCoverImage";
import type { ActionResult } from "@/types/api";

type Category = { id: string; name: string };

export function ProjectForm({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState<ActionResult<null> | null, FormData>(
    createProjectAction,
    null
  );
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const errors = state && !state.success ? state.fieldErrors ?? {} : {};

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadCoverImage(file);
      setCoverImageUrl(url);
    } catch {
      setUploadError("Upload failed. Try a different image.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-6 max-w-2xl">
      {state && !state.success && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold">Basics</h2>

        <label className="flex flex-col gap-1 text-sm">
          Title
          <input name="title" required className="rounded-md border border-input px-3 py-2 text-sm" />
          {errors.title && <span className="text-xs text-destructive">{errors.title[0]}</span>}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Short description
          <input
            name="shortDescription"
            required
            placeholder="One sentence — shows on the project card"
            className="rounded-md border border-input px-3 py-2 text-sm"
          />
          {errors.shortDescription && (
            <span className="text-xs text-destructive">{errors.shortDescription[0]}</span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Full description
          <textarea
            name="longDescription"
            required
            rows={6}
            className="rounded-md border border-input px-3 py-2 text-sm"
          />
          {errors.longDescription && (
            <span className="text-xs text-destructive">{errors.longDescription[0]}</span>
          )}
        </label>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold">Media</h2>

        <div className="flex flex-col gap-2 text-sm">
          Cover image
          <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
          {uploading && <span className="text-xs text-muted-foreground">Uploading…</span>}
          {uploadError && <span className="text-xs text-destructive">{uploadError}</span>}
          {coverImageUrl && (
            <div className="relative mt-2 h-32 w-56 overflow-hidden rounded-md">
              <Image src={coverImageUrl} alt="Cover preview" fill className="object-cover" />
            </div>
          )}
          <input type="hidden" name="coverImageUrl" value={coverImageUrl} />
        </div>

        <label className="flex flex-col gap-1 text-sm">
          Demo video URL
          <input name="demoVideoUrl" type="url" className="rounded-md border border-input px-3 py-2 text-sm" />
        </label>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold">Tech &amp; categories</h2>

        <label className="flex flex-col gap-1 text-sm">
          Technologies
          <input
            name="technologies"
            placeholder="React, PyTorch, PostgreSQL"
            className="rounded-md border border-input px-3 py-2 text-sm"
          />
          <span className="text-xs text-muted-foreground">Comma-separated.</span>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Tags
          <input
            name="tags"
            placeholder="capstone, hackathon, solo-project"
            className="rounded-md border border-input px-3 py-2 text-sm"
          />
          <span className="text-xs text-muted-foreground">Comma-separated.</span>
        </label>

        <fieldset className="flex flex-col gap-2 text-sm">
          <legend className="mb-1">Categories</legend>
          <div className="flex flex-wrap gap-3">
            {categories.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="categoryIds" value={c.id} />
                {c.name}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold">Links</h2>

        <label className="flex flex-col gap-1 text-sm">
          GitHub URL
          <input name="githubUrl" type="url" className="rounded-md border border-input px-3 py-2 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Live demo URL
          <input name="liveUrl" type="url" className="rounded-md border border-input px-3 py-2 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Documentation URL
          <input name="documentationUrl" type="url" className="rounded-md border border-input px-3 py-2 text-sm" />
        </label>
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          name="publish"
          value="draft"
          disabled={pending || uploading}
          className="rounded-md border border-input px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          Save draft
        </button>
        <button
          type="submit"
          name="publish"
          value="publish"
          disabled={pending || uploading}
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {pending ? "Publishing…" : "Publish"}
        </button>
      </div>
    </form>
  );
}
