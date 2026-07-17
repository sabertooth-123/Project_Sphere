import Link from "next/link";
import { buildQueryUrl } from "@/utils/buildQueryUrl";
import type { RawSearchParams } from "../parseSearchParams";

const OPTIONS: { value: string; label: string }[] = [
  { value: "recent", label: "Recent" },
  { value: "trending", label: "Trending" },
  { value: "most-liked", label: "Most liked" },
];

export function SortLinks({
  basePath,
  currentParams,
  activeSort,
}: {
  basePath: string;
  currentParams: RawSearchParams;
  activeSort: string;
}) {
  return (
    <div className="mb-6 flex gap-2 text-sm">
      {OPTIONS.map((opt) => (
        <Link
          key={opt.value}
          href={buildQueryUrl(basePath, currentParams, { sort: opt.value, cursor: undefined })}
          className={`rounded-md px-3 py-1.5 ${
            activeSort === opt.value ? "bg-primary text-primary-foreground" : "border border-input"
          }`}
        >
          {opt.label}
        </Link>
      ))}
    </div>
  );
}
