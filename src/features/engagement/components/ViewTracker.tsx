"use client";

import { useEffect } from "react";

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    navigator.sendBeacon(`/api/projects/${slug}/view`);
    // Fires once per page load — intentionally not deduped client-side;
    // the server hashes IP+UA+day for coarse dedup instead of trusting the client.
  }, [slug]);

  return null;
}
