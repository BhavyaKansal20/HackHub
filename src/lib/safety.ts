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

export const MAX_PHOTO_BYTES = 3_000_000;
export function validatePhotoHeader(bytes: Uint8Array, size: number, mime: string) {
  if (size > MAX_PHOTO_BYTES) throw new Error("Photo must be under 3 MB");
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const png = [137,80,78,71,13,10,26,10].every((v, i) => bytes[i] === v);
  const webp = String.fromCharCode(...bytes.slice(0,4)) === "RIFF" && String.fromCharCode(...bytes.slice(8,12)) === "WEBP";
  if (!((jpeg && mime === "image/jpeg") || (png && mime === "image/png") || (webp && mime === "image/webp"))) {
    throw new Error("Choose a valid JPEG, PNG or WebP photo");
  }
}

export async function compressPhoto(file: File): Promise<Blob> {
  validatePhotoHeader(new Uint8Array(await file.slice(0, 12).arrayBuffer()), file.size, file.type);
  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width * bitmap.height > 40_000_000) throw new Error("Photo dimensions are too large");
    const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not prepare photo");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Could not compress photo")), "image/webp", 0.82));
  } finally { bitmap.close(); }
}