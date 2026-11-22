import { resolve } from "node:path";
import sharp from "sharp";
import { expect, it } from "vitest";
import { articleImageVariants } from "../../../plugins/article-image-variants";

type Asset = { type: "asset"; fileName: string; source: Buffer };
type Context = {
  environment: { mode: "build" };
  emitFile: (asset: Asset) => string;
};
type Load = (this: Context, id: string) => Promise<string | null>;

it.each([480, 768])(
  "builds all five illustrations at %i pixels wide",
  async (width) => {
    const plugin = articleImageVariants();
    const load = plugin.load as unknown as Load;
    const emitted: Asset[] = [];
    const context: Context = {
      environment: { mode: "build" },
      emitFile: (asset) => {
        emitted.push(asset);
        return asset.fileName;
      },
    };
    for (const topic of ["clinical", "nutrition", "wellbeing", "mri", "skin"]) {
      const code = await load.call(
        context,
        `${resolve(`src/assets/articles/${topic}-education.webp`)}?article-width=${width}`,
      );
      const asset = emitted.at(-1);
      if (!asset) throw new Error("Image variant was not emitted");
      const metadata = await sharp(asset.source).metadata();
      expect(metadata.width).toBe(width);
      expect(metadata.format).toBe("webp");
      expect(code).toContain(`/${asset.fileName}`);
    }
    expect(emitted).toHaveLength(5);
  },
);

it("does not transform an unrelated image", async () => {
  const load = articleImageVariants().load as unknown as Load;
  expect(
    await load.call(
      {
        environment: { mode: "build" },
        emitFile: () => {
          throw new Error("Unexpected asset");
        },
      },
      "/unrelated.webp",
    ),
  ).toBeNull();
});
