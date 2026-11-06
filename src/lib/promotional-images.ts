/**
 * Provider product photos with promotional artwork baked in ("Bestseller",
 * "Save £…", postage offers). Editorial rules forbid provider marketing in
 * comparison content, so these are never shown; cards fall back to the
 * neutral kit placeholder instead.
 *
 * Built from an OCR audit of every active catalogue image (06/11/2026).
 * Paths are relative to the provider-test-images storage bucket and ignore
 * cache-busting query strings, so a re-uploaded copy at the same path stays
 * blocked until it is re-audited.
 */
const PROMOTIONAL_IMAGE_PATHS: ReadonlySet<string> = new Set([
  "clinilabs/6dd5936a-21ea-4bc5-8ed1-12f513c806c0-box.webp",
  "medichecks/1787c81d-e751-45e4-9ff8-1ec425eb2ea1-box.webp",
  "medichecks/220133fc-9e8d-469a-8b01-335909aa147b-box.webp",
  "medichecks/6a9beab5-8ec7-42da-a363-e032fd852286-box.webp",
  "medichecks/82645a71-d1a0-4cf1-b1f5-59a7d320d525-box.webp",
  "medichecks/8d36762d-d0f7-4e9e-bcbe-f1a103408dbb-box.webp",
  "medichecks/8e95ac99-14fd-4612-ad53-7310a9f1f564-box.webp",
  "medichecks/be04a2b5-6605-4bab-a10f-012f0c788c1b-box.webp",
  "medichecks/dcf63c26-ecec-4686-9407-70f12e55f3ca-box.webp",
  "medichecks/eb605f9e-7cd2-46ea-98c7-6d736a883481-box.webp",
  "medichecks/ffba5207-8a12-45b7-a3fb-97594947f5da-box.webp",
]);

const BUCKET_MARKER = "/provider-test-images/";

export const isPromotionalImage = (url: string | null | undefined): boolean => {
  if (!url) return false;
  const at = url.indexOf(BUCKET_MARKER);
  if (at === -1) return false;
  const path = url.slice(at + BUCKET_MARKER.length).split("?")[0] ?? "";
  return PROMOTIONAL_IMAGE_PATHS.has(path);
};
