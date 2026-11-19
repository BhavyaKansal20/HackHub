import { describe, expect, it } from "vitest";
import { contactHref, safeWebUrl, validatePhotoHeader } from "@/lib/safety";
describe("launch safety", () => {
  it("blocks executable links", () => { expect(safeWebUrl("javascript:alert(1)")).toBeUndefined(); });
  it("rejects lookalike professional domains", () => { expect(safeWebUrl("https://github.com.evil.test/a", "github.com")).toBeUndefined(); });
  it("makes emails clickable", () => { expect(contactHref("Email", "multimodexai@gmail.com")).toBe("mailto:multimodexai@gmail.com"); });
  it("makes phones clickable", () => { expect(contactHref("Phone", "+91 9876543210")).toBe("tel:+919876543210"); });
  it("rejects photos over 3 MB", () => { expect(() => validatePhotoHeader(new Uint8Array([255,216,255]), 3_000_001, "image/jpeg")).toThrow("3 MB"); });
  it("rejects disguised files", () => { expect(() => validatePhotoHeader(new Uint8Array([60,115,118,103]), 100, "image/jpeg")).toThrow("valid JPEG"); });
});