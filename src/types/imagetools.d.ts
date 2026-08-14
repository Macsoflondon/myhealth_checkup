/**
 * Type declarations for vite-imagetools query imports.
 * `?...&as=srcset` yields a ready-to-use srcset string; a plain query yields a URL.
 */
declare module "*&as=srcset" {
  const srcset: string;
  export default srcset;
}

declare module "*?as=srcset" {
  const srcset: string;
  export default srcset;
}
