// Retired 2026-10-26: this function overwrote Randox kit images with lifestyle
// photos. Randox images are managed by randox-kit-images.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve((req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });
  return new Response(
    JSON.stringify({
      error: "Retired 2026-10-26. Randox images are managed by randox-kit-images.",
    }),
    {
      status: 410,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
