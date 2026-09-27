import { describe, expect, it } from "vitest";
import {
  assertUploadableFile,
  buildTestResultObjectKey,
  isOwnedByUser,
  TEST_RESULTS_MAX_BYTES,
} from "../testResultsPath";

const USER_A = "11111111-2222-4333-8444-555555555555";
const USER_B = "99999999-8888-4777-8666-555555555555";

describe("buildTestResultObjectKey", () => {
  it("places the object beneath the authenticated user's id", () => {
    const key = buildTestResultObjectKey(USER_A, "results.pdf", 1_700_000_000_000);
    expect(key.split("/")[0]).toBe(USER_A);
    expect(key).toBe(`${USER_A}/1700000000000-results.pdf`);
  });

  it("refuses to build a key without a valid user id", () => {
    expect(() => buildTestResultObjectKey("", "results.pdf")).toThrow();
    expect(() => buildTestResultObjectKey("anonymous", "results.pdf")).toThrow();
  });

  it("neutralises path traversal and separators in the file name", () => {
    const key = buildTestResultObjectKey(USER_A, "../../etc/passwd", 1);
    expect(key.startsWith(`${USER_A}/`)).toBe(true);
    expect(key.split("/")).toHaveLength(2);
    expect(key).not.toContain("..");
  });

  it("cannot be coerced into another user's prefix via the file name", () => {
    const key = buildTestResultObjectKey(USER_A, `${USER_B}/stolen.pdf`, 1);
    expect(key.split("/")[0]).toBe(USER_A);
    expect(isOwnedByUser(key, USER_B)).toBe(false);
  });
});

describe("isOwnedByUser", () => {
  it("accepts a key under the user's own prefix", () => {
    expect(isOwnedByUser(`${USER_A}/1-report.pdf`, USER_A)).toBe(true);
  });

  it("rejects a key under another user's prefix", () => {
    expect(isOwnedByUser(`${USER_B}/1-report.pdf`, USER_A)).toBe(false);
  });

  it("rejects a bare key with no prefix", () => {
    expect(isOwnedByUser("report.pdf", USER_A)).toBe(false);
  });
});

describe("assertUploadableFile", () => {
  it("accepts a laboratory PDF within the limit", () => {
    expect(() =>
      assertUploadableFile({ size: 2_000_000, type: "application/pdf" }),
    ).not.toThrow();
  });

  it("rejects an oversized file", () => {
    expect(() =>
      assertUploadableFile({
        size: TEST_RESULTS_MAX_BYTES + 1,
        type: "application/pdf",
      }),
    ).toThrow(/too large/i);
  });

  it("rejects a disallowed file type", () => {
    expect(() =>
      assertUploadableFile({ size: 1000, type: "application/x-msdownload" }),
    ).toThrow(/only pdf/i);
  });
});
