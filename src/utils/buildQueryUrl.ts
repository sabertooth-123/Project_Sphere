type QueryValue = string | string[] | undefined;

export function buildQueryUrl(
  basePath: string,
  params: Record<string, QueryValue>,
  overrides: Record<string, QueryValue> = {}
) {
  const merged = { ...params, ...overrides };
  const usp = new URLSearchParams();

  for (const [key, value] of Object.entries(merged)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => usp.append(key, v));
    } else {
      usp.set(key, value);
    }
  }

  const qs = usp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
