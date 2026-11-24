/**
 * 照片上传与客户端高性能压缩服务
 * 确保手机拍照与高分辨率照片在客户端完成画质优化与压缩，
 * 既保证视觉细腻度，又避免超出浏览器与服务端负载
 */

export interface ProcessedImageResult {
  dataUrl: string;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
}

/**
 * 将 File 对象压缩处理为轻量的高清 WebP / JPEG DataURL
 */
export async function processImageFile(
  file: File,
  maxWidth = 1600,
  quality = 0.82
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("读取照片失败"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("照片解码失败"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // 等比例缩放
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("无法创建画板上下文"));
          return;
        }

        // 高质量绘制
        ctx.drawImage(img, 0, 0, width, height);

        // 优先输出 WebP 格式，若不支持则降级为 JPEG
        let dataUrl = "";
        try {
          dataUrl = canvas.toDataURL("image/webp", quality);
        } catch {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        const compressedSize = Math.round((dataUrl.length * 3) / 4);

        resolve({
          dataUrl,
          width,
          height,
          originalSize: file.size,
          compressedSize,
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
