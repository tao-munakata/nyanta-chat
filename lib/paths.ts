function normalizeBasePath(value: string | undefined): string {
  if (!value || value === "/") return "";
  return value.startsWith("/") ? value : `/${value}`;
}

export const BASE_PATH = normalizeBasePath(
  process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.BASE_PATH
);

export function withBasePath(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalizedPath}`;
}
