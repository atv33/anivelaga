const rawBase = import.meta.env.BASE_URL ?? "/";

export const siteBase = rawBase === "/" ? "" : rawBase.replace(/\/$/, "");

export function withBase(path: string) {
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("mailto:") ||
    path.startsWith("#")
  ) {
    return path;
  }

  if (path === "/") return siteBase ? `${siteBase}/` : "/";
  if (path.startsWith("/")) return `${siteBase}${path}`;
  return siteBase ? `${siteBase}/${path}` : `/${path}`;
}

export function routerBasepath() {
  return siteBase || undefined;
}
