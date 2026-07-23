import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchTests from "./tools/search-tests";
import getTest from "./tools/get-test";
import listProviders from "./tools/list-providers";
import listMyFavourites from "./tools/list-my-favourites";
import saveFavourite from "./tools/save-favourite";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "myhealth-checkup-mcp",
  title: "myhealth checkup",
  version: "0.1.0",
  instructions:
    "Tools for myhealth checkup — the UK private diagnostics comparison platform. Use search_tests and get_test to compare private blood tests and cancer screening across UKAS-accredited, CQC-regulated providers (prices in GBP, turnaround in days). list_providers enumerates partner labs. list_my_favourites and save_favourite act on the signed-in user's saved tests. This platform is decision infrastructure only — never present results as medical advice or diagnosis.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchTests, getTest, listProviders, listMyFavourites, saveFavourite],
});
