"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { createProjectAction } from "../actions";
import { uploadCoverImage } from "../uploadCoverImage";
import { MotionButton } from "@/components/ui/MotionButton";
import type { ActionResult } from "@/types/api";

type Category = { id: string; name: string };

type ProjectFormDefaults = {
  title?: string;
  shortDescription?: string;
  longDescription?: string;
  coverImageUrl?: string;
  demoVideoUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  documentationUrl?: string;
  technologies?: string;
  tags?: string;
  categoryIds?: string[];
};

type BoundAction = (
  prev: ActionResult<null> | null,
  formData: FormData
) => Promise<ActionResult<null>>;

export function ProjectForm({
  categories,
  action,
  defaults,
}: {
  categories: Category[];
  action?: BoundAction;
  defaults?: ProjectFormDefaults;
}) {
  const isEdit = Boolean(action);
  const [state, formAction, pending] = useActionState<ActionResult<null> | null, FormData>(
    action ?? createProjectAction,
    null
  );
  const [coverImageUrl, setCoverImageUrl] = useState(defaults?.coverImageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const errors = state && !state.success ? state.fieldErrors ?? {} : {};
  const categoryIds = new Set(defaults?.categoryIds ?? []);

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
          <input
            name="title"
            required
            defaultValue={defaults?.title}
            className="rounded-md border border-input px-3 py-2 text-sm"
          />
          {errors.title && <span className="text-xs text-destructive">{errors.title[0]}</span>}
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Short description
          <input
            name="shortDescription"
            required
            defaultValue={defaults?.shortDescription}
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
            defaultValue={defaults?.longDescription}
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
          <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm hover:bg-accent">
            <span>{uploading ? "Uploading…" : coverImageUrl ? "Change image" : "Choose image"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
          {uploadError && <span className="text-xs text-destructive">{uploadError}</span>}
          {coverImageUrl && !uploading && (
            <div className="relative mt-2 h-32 w-56 overflow-hidden rounded-md border border-border">
              <Image src={coverImageUrl} alt="Cover preview" fill className="object-cover" />
            </div>
          )}
          <input type="hidden" name="coverImageUrl" value={coverImageUrl} />
        </div>

        <label className="flex flex-col gap-1 text-sm">
          Demo video URL
          <input
            name="demoVideoUrl"
            type="url"
            defaultValue={defaults?.demoVideoUrl}
            className="rounded-md border border-input px-3 py-2 text-sm"
          />
        </label>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold">Tech &amp; categories</h2>

        <label className="flex flex-col gap-1 text-sm">
          Technologies
          <input
            name="technologies"
            defaultValue={defaults?.technologies}
            placeholder="React, PyTorch, PostgreSQL"
            className="rounded-md border border-input px-3 py-2 text-sm"
          />
          <span className="text-xs text-muted-foreground">Comma-separated.</span>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Tags
          <input
            name="tags"
            defaultValue={defaults?.tags}
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
                <input
                  type="checkbox"
                  name="categoryIds"
                  value={c.id}
                  defaultChecked={categoryIds.has(c.id)}
                />
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
          <input
            name="githubUrl"
            type="url"
            defaultValue={defaults?.githubUrl}
            className="rounded-md border border-input px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Live demo URL
          <input
            name="liveUrl"
            type="url"
            defaultValue={defaults?.liveUrl}
            className="rounded-md border border-input px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Documentation URL
          <input
            name="documentationUrl"
            type="url"
            defaultValue={defaults?.documentationUrl}
            className="rounded-md border border-input px-3 py-2 text-sm"
          />
        </label>
      </section>

      {isEdit ? (
        <div className="flex gap-3">
          <MotionButton type="submit" disabled={pending || uploading}>
            {pending ? "Saving…" : "Save changes"}
          </MotionButton>
        </div>
      ) : (
        <div className="flex gap-3">
          <MotionButton
            type="submit"
            name="publish"
            value="draft"
            variant="secondary"
            disabled={pending || uploading}
          >
            Save draft
          </MotionButton>
          <MotionButton type="submit" name="publish" value="publish" disabled={pending || uploading}>
            {pending ? "Publishing…" : "Publish"}
          </MotionButton>
        </div>
      )}
    </form>
  );
}
