export type RawSearchParams = Record<string, string | string[] | undefined>;

const SORTS = ["trending", "recent", "most-liked"] as const;
export type SortOption = (typeof SORTS)[number];

export function parseExploreParams(sp: RawSearchParams) {
  const q = typeof sp.q === "string" && sp.q.trim() ? sp.q.trim() : undefined;
  const categorySlug = typeof sp.category === "string" && sp.category ? sp.category : undefined;
  const departmentSlug = typeof sp.department === "string" && sp.department ? sp.department : undefined;
  const technologySlugs = sp.technology
    ? Array.isArray(sp.technology)
      ? sp.technology
      : [sp.technology]
    : undefined;
  const sort: SortOption = SORTS.includes(sp.sort as SortOption) ? (sp.sort as SortOption) : "recent";
  const cursor = typeof sp.cursor === "string" && sp.cursor ? sp.cursor : undefined;

  return { q, categorySlug, departmentSlug, technologySlugs, sort, cursor };
}
