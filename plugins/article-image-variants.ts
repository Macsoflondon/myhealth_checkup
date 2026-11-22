import { createHash } from "node:crypto";
import { basename, join } from "node:path";
import sharp from "sharp";
import type { Plugin } from "vite";

const topics = ["clinical", "nutrition", "wellbeing", "mri", "skin"] as const;
const widths = [480, 768] as const;

/** Resize bundled illustrations during the build; never import sharp at runtime. */
export function articleImageVariants(): Plugin {
  const variants = new Map<string, Promise<Buffer>>();
  const resize = (file: string, width: number): Promise<Buffer> => {
    const key = `${file}:${width}`;
    const existing = variants.get(key);
    if (existing) return existing;
    const pending = sharp(file)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();
    variants.set(key, pending);
    return pending;
  };
  const pattern =
    /\/((?:clinical|nutrition|wellbeing|mri|skin)-education)\.webp\?article-width=(480|768)$/;
  return {
    name: "myhealth-article-image-variants",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const match =
          /^\/__article-image-variants\/([a-z]+)-education-(480|768)\.webp$/.exec(
            request.url ?? "",
          );
        const topic = match?.[1];
        const width = Number(match?.[2]);
        if (
          !topic ||
          !topics.some((item) => item === topic) ||
          !widths.some((item) => item === width)
        )
          return next();
        try {
          const image = await resize(
            join(
              server.config.root,
              "src/assets/articles",
              `${topic}-education.webp`,
            ),
            width,
          );
          response.setHeader("Content-Type", "image/webp");
          response.setHeader("Cache-Control", "public, max-age=3600");
          response.end(image);
        } catch (error) {
          next(error);
        }
      });
    },
    async load(id) {
      const match = pattern.exec(id);
      const name = match?.[1];
      if (!name) return null;
      const file = id.split("?")[0];
      if (!file) return null;
      const width = Number(match?.[2]);
      const image = await resize(file, width);
      if (this.environment.mode === "dev") {
        return `export default ${JSON.stringify(`/__article-image-variants/${name}-${width}.webp`)};`;
      }
      const hash = createHash("sha256")
        .update(image)
        .digest("hex")
        .slice(0, 12);
      const fileName = `assets/articles/${basename(file, ".webp")}-${width}-${hash}.webp`;
      this.emitFile({ type: "asset", fileName, source: image });
      return `export default ${JSON.stringify(`/${fileName}`)};`;
    },
  };
}
