// Adapter registry: one adapter per catalogue plugin of kind "sync". Add new
// adapters here after adding the plugin to _shared/os/catalog.ts.
import type { PluginAdapter } from "./types.ts";
import { adapter as siteStatus } from "./site-status.ts";
import { adapter as ga4 } from "./ga4.ts";
import { adapter as searchConsole } from "./search-console.ts";
import { adapter as metricool } from "./metricool.ts";
import { adapter as awin } from "./awin.ts";
import { adapter as stripe } from "./stripe.ts";

export const ADAPTERS: Record<string, PluginAdapter> = {
  site_status: siteStatus,
  ga4,
  search_console: searchConsole,
  metricool,
  awin,
  stripe,
};

export function getAdapter(pluginId: string): PluginAdapter | undefined {
  return Object.prototype.hasOwnProperty.call(ADAPTERS, pluginId)
    ? ADAPTERS[pluginId]
    : undefined;
}
