// Pure URL rules shared by verification and catalogue matching.
export function normalisedProductPath(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).pathname.toLowerCase().replace(/\/+$/, "") || "/";
  } catch {
    return null;
  }
}

export function shopifyProductHandle(
  value: string | null,
  domain: string,
): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (
      url.hostname.replace(/^www\./, "") !==
      new URL(domain).hostname.replace(/^www\./, "")
    )
      return null;
    return (
      url.pathname.match(/^\/products\/([^/]+)\/?$/i)?.[1]?.toLowerCase() ??
      null
    );
  } catch {
    return null;
  }
}

export function productRedirectIssue(
  requested: string,
  final: string,
): string | null {
  const requestedPath = normalisedProductPath(requested);
  const finalPath = normalisedProductPath(final);
  if (!requestedPath || !finalPath) return null;
  if (requestedPath !== "/" && finalPath === "/")
    return "redirected to homepage";
  if (requestedPath.includes("/products/") && !finalPath.includes("/products/"))
    return "redirected away from product";
  return null;
}
