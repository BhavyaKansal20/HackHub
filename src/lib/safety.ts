export function safeWebUrl(value: string | null | undefined, host?: string): string | undefined {
  try {
    const url = new URL(value ?? "");
    if (url.protocol !== "https:" || url.username || url.password) return undefined;
    if (host && url.hostname !== host && url.hostname !== `www.${host}`) return undefined;
    return url.href;
  } catch { return undefined; }
}

export function contactHref(kind: string, value: string): string | undefined {
  if (kind === "Email" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return `mailto:${value}`;
  if (kind === "Phone" && /^\+?[\d ]{10,15}$/.test(value)) return `tel:${value.replace(/ /g, "")}`;
  if (kind === "LinkedIn") return safeWebUrl(value, "linkedin.com");
  return undefined;
}

export const MAX_PHOTO_BYTES = 15_000_000; // 15 MB

export function validatePhotoHeader(bytes: Uint8Array, size: number, mime: string) {
  if (size > MAX_PHOTO_BYTES) throw new Error("Photo must be under 15 MB");
  const normalizedMime = mime.toLowerCase();
  const isImageMime = normalizedMime.startsWith("image/");
  if (!isImageMime) {
    throw new Error("Please select a valid image file (PNG, JPEG, WebP, GIF, SVG, AVIF, BMP)");
  }
}

export async function compressPhoto(file: Blob, mimeType: string = "image/webp"): Promise<Blob> {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  validatePhotoHeader(bytes, file.size, file.type || mimeType);
  
  // For SVGs, return directly as blob
  if (file.type === "image/svg+xml") {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width * bitmap.height > 60_000_000) throw new Error("Photo dimensions are too large");
    const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not prepare photo");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not compress photo"))), "image/webp", 0.85),
    );
  } finally {
    bitmap.close();
  }
}