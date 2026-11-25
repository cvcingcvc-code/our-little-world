export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * 为 public 目录下的静态资源路径自动补全 basePath
 * 兼容 Vercel 根路径部署 (/) 与 GitHub Pages 子路径部署 (/our-little-world)
 */
export function withBasePath(path: string): string {
  if (!path) return path;
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }
  if (!BASE_PATH || path.startsWith(BASE_PATH)) {
    return path;
  }
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
