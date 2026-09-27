/**
 * Object-key rules for the private `test-results` storage bucket.
 *
 * Every RLS policy on the bucket is gated on
 *   auth.uid()::text = (storage.foldername(name))[1]
 * so per-user isolation depends entirely on every upload path writing beneath a
 * `<authenticated-user-id>/` prefix. This module is the single place that
 * invariant is expressed, and it is covered by regression tests so it cannot be
 * broken silently.
 */

/** Maximum accepted upload size, mirroring the bucket-level limit. */
export const TEST_RESULTS_MAX_BYTES = 20 * 1024 * 1024;

/** MIME types accepted for laboratory reports and result photographs. */
export const TEST_RESULTS_ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export type TestResultsMimeType = (typeof TEST_RESULTS_ALLOWED_MIME_TYPES)[number];

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Strip anything that could escape the user's prefix or confuse the storage API. */
const sanitiseSegment = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[\\/]+/g, "-")
    .replace(/\.{2,}/g, ".")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^[.-]+/, "")
    .slice(0, 120);

/**
 * Build the canonical object key for a user's uploaded result document.
 * Always `<userId>/<timestamp>-<safe-file-name>`.
 */
export const buildTestResultObjectKey = (
  userId: string,
  originalFileName: string,
  now: number = Date.now(),
): string => {
  if (!UUID_PATTERN.test(userId)) {
    throw new Error("A valid authenticated user id is required to upload a result");
  }
  const safeName = sanitiseSegment(originalFileName) || "result";
  return `${userId}/${now}-${safeName}`;
};

/** True when the key sits beneath the given user's prefix. */
export const isOwnedByUser = (objectKey: string, userId: string): boolean =>
  typeof objectKey === "string" &&
  objectKey.split("/")[0] === userId &&
  objectKey.split("/").length > 1;

/** Reject files the bucket would refuse, before the network round trip. */
export const assertUploadableFile = (file: {
  size: number;
  type: string;
}): void => {
  if (file.size > TEST_RESULTS_MAX_BYTES) {
    throw new Error(
      `File is too large. The limit is ${TEST_RESULTS_MAX_BYTES / (1024 * 1024)}MB.`,
    );
  }
  if (
    !(TEST_RESULTS_ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)
  ) {
    throw new Error("Only PDF documents and JPEG, PNG, WebP or HEIC images are accepted.");
  }
};
