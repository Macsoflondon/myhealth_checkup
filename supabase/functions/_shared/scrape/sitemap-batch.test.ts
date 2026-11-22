import { assertEquals } from "jsr:@std/assert@1.0.19";
import { sitemapBatch } from "./sitemap-batch.ts";

for (const [count, sizes] of [
  [150, [30, 30, 30, 30, 30]],
  [151, [31, 31, 31, 31, 27]],
  [180, [36, 36, 36, 36, 36]],
] as const) {
  Deno.test(
    `${count} matched URLs appear in exactly one of the five existing batches`,
    () => {
      const urls = Array.from(
        { length: count },
        (_, index) =>
          `https://www.medical-diagnosis.co.uk/exam/profiles/test-${String(index).padStart(3, "0")}/?v=1`,
      ).reverse();
      const batches = [0, 30, 60, 90, 120].map((offset) =>
        sitemapBatch(urls, offset, 30, 5),
      );
      assertEquals(
        batches.map((batch) => batch.slice.length),
        [...sizes],
      );
      assertEquals(
        batches.map((batch) => batch.batchIndex),
        [0, 1, 2, 3, 4],
      );
      assertEquals(
        batches.map((batch) => batch.sliceSize),
        Array(5).fill(Math.ceil(count / 5)),
      );
      const covered = batches.flatMap((batch) => batch.slice);
      assertEquals(covered.length, count);
      assertEquals(new Set(covered).size, count);
      assertEquals(covered, [...urls].reverse());
      assertEquals(
        sitemapBatch([...urls].reverse(), 120, 30, 5).slice,
        batches[4]?.slice,
      );
    },
  );
}

Deno.test(
  "order uses normalised paths rather than hostname or source order",
  () => {
    const urls = [
      "https://a.test/exam/Z/?v=1",
      "https://z.test/exam/a/",
      "https://b.test/exam/M",
    ];
    assertEquals(sitemapBatch(urls, 0, 30, 5).orderedUrls, [
      urls[1],
      urls[2],
      urls[0],
    ]);
  },
);
