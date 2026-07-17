type Option = { slug: string; name: string };

export function FilterBar({
  categories,
  departments,
  technologies,
  defaults,
}: {
  categories: Option[];
  departments: Option[];
  technologies: Option[];
  defaults: {
    q?: string;
    categorySlug?: string;
    departmentSlug?: string;
    technologySlugs?: string[];
    sort: string;
  };
}) {
  return (
    <form method="get" className="mb-8 flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          name="q"
          defaultValue={defaults.q}
          placeholder="Search projects…"
          className="flex-1 min-w-[200px] rounded-md border border-input px-3 py-2 text-sm"
        />
        <select
          name="sort"
          defaultValue={defaults.sort}
          className="rounded-md border border-input px-3 py-2 text-sm"
        >
          <option value="recent">Recent</option>
          <option value="trending">Trending</option>
          <option value="most-liked">Most liked</option>
        </select>
        <select
          name="category"
          defaultValue={defaults.categorySlug ?? ""}
          className="rounded-md border border-input px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          name="department"
          defaultValue={defaults.departmentSlug ?? ""}
          className="rounded-md border border-input px-3 py-2 text-sm"
        >
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="flex flex-wrap gap-3 text-sm">
        <legend className="mb-1 w-full text-xs uppercase tracking-wide text-muted-foreground">
          Technology
        </legend>
        {technologies.map((t) => (
          <label key={t.slug} className="flex items-center gap-1.5">
            <input
              type="checkbox"
              name="technology"
              value={t.slug}
              defaultChecked={defaults.technologySlugs?.includes(t.slug)}
            />
            {t.name}
          </label>
        ))}
      </fieldset>

      <button
        type="submit"
        className="self-start rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium"
      >
        Apply filters
      </button>
    </form>
  );
}
