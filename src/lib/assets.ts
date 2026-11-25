export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * 为 public 目录下的静态资源路径自动补全 basePath
 * 三重保障：兼容构建期 NEXT_PUBLIC_BASE_PATH、GitHub Pages 子路径运行时识别与 Vercel 根路径部署
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

  let effectiveBase = BASE_PATH;
  if (!effectiveBase && typeof window !== "undefined") {
    if (window.location.pathname.startsWith("/our-little-world")) {
      effectiveBase = "/our-little-world";
    }
  }

  if (!effectiveBase || path.startsWith(effectiveBase)) {
    return path;
  }
  return `${effectiveBase}${path.startsWith("/") ? path : `/${path}`}`;
}
