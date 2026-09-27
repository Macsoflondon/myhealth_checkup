// mhc-randox-scrape — myhealth checkup
// 2026-09-02: write descriptionScraped straight into the customer-facing description
// field too (verbatim, no LLM rewrite) — description must always be the provider's own text.
// 2026-09-21: this file was previously deployed straight from the Supabase dashboard and
// not tracked in this repo at all — pulled in here for reviewability as part of a platform
// audit. SECRET below intentionally has NO hardcoded fallback in this copy: the deployed
// function's real fallback value is a rotated secret that must never be committed to git.
// Set the MHC_SYNC_SECRET edge function secret in the Supabase dashboard; this file will not
// authenticate correctly until you do, by design.
import { createClient } from "npm:@supabase/supabase-js@2";
const SECRET = Deno.env.get("MHC_SYNC_SECRET") ?? "";
const PROVIDER = "randox";
const SITEMAPS = ["https://randoxhealth.com/sitemap.xml"];
const URLMATCH = /\/en-GB\/product\//i;
const URLEXCLUDE = /gift-card|corporate|training|refer-a-friend/i;

function norm(s){return (s||"").toLowerCase().replace(/™|®/g,"").replace(/[^a-z0-9]+/g," ").replace(/\b(blood )?test\b/g," ").replace(/\bhealth\b|\bcheck\b|\bprofile\b/g," ").replace(/\s+/g," ").trim();}
function slugRaw(u){return (u.replace(/[?#].*$/,"").replace(/\/+$/,"").split("/").pop()||"").toLowerCase();}
function slugNorm(u){return norm(slugRaw(u).replace(/-/g," "));}
function stripTags(s){return (s||"").replace(/<[^>]+>/g," ").replace(/&amp;/g,"&").replace(/&nbsp;/g," ").replace(/&#8211;|&ndash;/g,"-").replace(/\s+/g," ").trim();}
function deriveCategory(n){n=n.toLowerCase();
 if(/cancer|trucheck|guardant|tumour/.test(n))return "Cancer Screening";
 if(/sti|sexual|hiv|chlamydia|gonorrh/.test(n))return "Sexual Health";
 if(/thyroid/.test(n))return "Thyroid Function";
 if(/testosterone|hormone|fertility|menopause|oestr|prolactin/.test(n))return "Hormone Health";
 if(/vitamin|mineral|nutrition/.test(n))return "Vitamin & Nutrient Testing";
 if(/heart|cardiac|cholesterol|lipid/.test(n))return "Heart Health";
 if(/liver/.test(n))return "Comprehensive Blood Panels";
 if(/kidney/.test(n))return "Comprehensive Blood Panels";
 if(/diabet|hba1c|glucose/.test(n))return "Diabetes & Blood Sugar";
 if(/bowel|digest|gut|coeliac|h.?pylori/.test(n))return "Gut Health";
 if(/sport|performance|fitness/.test(n))return "Fitness & Performance";
 if(/dna|genetic|haemochromatosis/.test(n))return "Longevity Tests";
 if(/prostate|psa|erectile|male/.test(n))return "Men's Health";
 if(/iron|anaemia|ferritin/.test(n))return "Iron & Anaemia";
 return "Comprehensive Blood Panels";}
async function fetchText(url){const r=await fetch(url,{headers:{"User-Agent":"myhealthcheckup-sync/1.0"}});if(!r.ok)return "";const buf=new Uint8Array(await r.arrayBuffer());if(buf[0]===0x1f&&buf[1]===0x8b){const stream=new Response(buf).body.pipeThrough(new DecompressionStream("gzip"));return await new Response(stream).text();}return new TextDecoder().decode(buf);}
async function getUrls(){let urls=[];for(const sm of SITEMAPS){const xml=await fetchText(sm);if(!xml)continue;const locs=[...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(m=>m[1].trim());if(/<sitemapindex/i.test(xml)){for(const sub of locs){const sx=await fetchText(sub);for(const m of sx.matchAll(/<loc>([^<]+)<\/loc>/gi)){urls.push(m[1].trim());}}}else{urls.push(...locs);}}return [...new Set(urls)].filter(u=>URLMATCH.test(u)&&!URLEXCLUDE.test(u));}
function extractName(html){
  const og=html.match(/property="og:title"\s+content="([^"]+)"/i);
  if(og)return og[1].replace(/\s*\|.*$/,"").replace(/\s*Blood Test\s*$/i,"").trim();
  const h1=html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if(h1){const t=stripTags(h1[1]).trim();if(t&&t.toLowerCase()!=="randox health")return t;}
  const title=html.match(/<title>([^<]+)<\/title>/i);
  if(title){const t=title[1].replace(/\s*[|\-–]\s*Randox Health\s*$/i,"").trim();if(t&&t.toLowerCase()!=="randox health")return t;}
  return null;
}
// 2026-09-01, v2: prefer the JSON-LD Product "description" field (confirmed
// on this site to carry real clinical copy, e.g. the Advanced PSA / PSA
// Quickdraw samples) over the position-bounded slice. One page (ECG Test)
// was previously captured as pure analytics/widget script noise because the
// fallback ran on unstripped script content — now strips all <script>
// blocks before falling back.
function extractJsonLdDescription(html){
  const matches=[...html.matchAll(/"description"\s*:\s*"((?:[^"\\]|\\.)*)"/gi)];
  let best=null;
  for(const m of matches){
    const val=m[1].replace(/\\\//g,"/").replace(/\\n/g," ").replace(/\\"/g,'"').replace(/\s+/g," ").trim();
    if(val.length>40 && (!best||val.length>best.length)) best=val;
  }
  return best && best.length>40 ? best.slice(0,4000) : null;
}
function extractDescriptionScraped(html,name){
  const jsonLd=extractJsonLdDescription(html);
  if(jsonLd) return jsonLd;
  const cleanedHtml=html.replace(/<script[\s\S]*?<\/script>/gi," ");
  const txt=stripTags(cleanedHtml);
  let startIdx=0;
  if(name){const idx=txt.indexOf(name); if(idx>=0) startIdx=idx+name.length;}
  const landmarks=["Add to basket","Add to cart","Related products","You may also like","Book now"];
  let endIdx=txt.length;
  for(const lm of landmarks){const i=txt.indexOf(lm,startIdx); if(i>=0 && i<endIdx) endIdx=i;}
  if(endIdx-startIdx>4500) endIdx=startIdx+4500;
  const slice=txt.slice(startIdx,endIdx).trim();
  return slice && slice.length>20 ? slice.slice(0,4000) : null;
}
function parsePage(html){
  let name=extractName(html);
  let price=null;const pm=stripTags(html).match(/£\s*([\d,]+(?:\.\d{2})?)/);if(pm)price=parseFloat(pm[1].replace(/,/g,""));
  const txt=stripTags(html);let taText=null,taDays=null;let m=txt.match(/within\s*(\d+)\s*(?:to|[-–])\s*(\d+)\s*days/i);if(m){taDays=parseInt(m[2]);taText=`Results typically within ${m[1]}–${m[2]} days`;}else{m=txt.match(/within\s*(\d+)\s*days/i);if(m){taDays=parseInt(m[1]);taText=`Results typically within ${m[1]} days`;}}if(!taText){m=txt.match(/(\d+)\s*working days/i);if(m){taDays=parseInt(m[1]);taText=`Results in ${m[1]} working days`;}}
  let sample="Venous";if(/finger-?prick/i.test(txt))sample="Finger-prick or venous";
  const descriptionScraped=extractDescriptionScraped(html,name);
  return {name,price,taText,taDays,sample,descriptionScraped};
}
Deno.serve(async (req)=>{
  const u=new URL(req.url);
  if(u.searchParams.get("secret")!==SECRET) return new Response("unauthorized",{status:401});
  const startedAt=new Date().toISOString();
  const debug=u.searchParams.get("debug");const dry=u.searchParams.get("dry")==="1";
  const offset=parseInt(u.searchParams.get("offset")||"0");const limit=parseInt(u.searchParams.get("limit")||"20");
  const supabase=createClient(Deno.env.get("SUPABASE_URL"),Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
  const urls=await getUrls();
  if(debug==="sitemap") return new Response(JSON.stringify({ok:true,total_product_urls:urls.length,sample:urls.slice(0,25)},null,2),{headers:{"content-type":"application/json"}});
  const {data:rows}=await supabase.from("provider_tests").select("id,test_name,url").eq("provider_id",PROVIDER).eq("is_active",true);
  const byNorm=new Map();const bySlug=new Map();for(const r of rows||[]){byNorm.set(norm(r.test_name),r);if(r.url)bySlug.set(slugRaw(r.url),r);}
  const slice=urls.slice(offset,offset+limit);
  const results=[];const newItems=[];const skippedNoNameOrPrice=[];let updated=0,inserted=0,redir=0;
  for(const url of slice){
    let html="";let finalUrl=url;try{const r=await fetch(url,{headers:{"User-Agent":"myhealthcheckup-sync/1.0"}});if(!r.ok)continue;finalUrl=r.url||url;html=await r.text();}catch(_e){continue;}
    if(slugRaw(finalUrl)!==slugRaw(url)){redir++;continue;}
    const p=parsePage(html);
    if(!p.name||!p.price||p.price<=0){skippedNoNameOrPrice.push({url,name:p.name,price:p.price});continue;}
    const row=bySlug.get(slugRaw(url))||byNorm.get(norm(p.name));
    if(row){
      if(!dry){const upd={url,scrape_source_url:url,url_verified:true,price:p.price,base_price:p.price,total_expected_cost:p.price,price_not_stated:false,last_validated_at:new Date().toISOString()};if(p.taText){upd.turnaround_days_text=p.taText;upd.turnaround_days=p.taDays;upd.turnaround_not_stated=false;}if(p.sample)upd.sample_type=p.sample;if(p.descriptionScraped){upd.description_scraped=p.descriptionScraped;upd.description=p.descriptionScraped;upd.description_source="scraped_verbatim";upd.description_generated_at=new Date().toISOString();}await supabase.from("provider_tests").update(upd).eq("id",row.id);}updated++;
    } else {
      newItems.push({test_name:p.name,url,price:p.price,category:deriveCategory(p.name),turnaround:p.taText});
      if(!dry){const ins={provider_id:PROVIDER,test_name:p.name,url,scrape_source_url:url,url_verified:true,price:p.price,base_price:p.price,total_expected_cost:p.price,price_not_stated:false,category:deriveCategory(p.name),sample_type:p.sample,biomarkers_not_stated:true,is_active:true,last_validated_at:new Date().toISOString()};if(p.taText){ins.turnaround_days_text=p.taText;ins.turnaround_days=p.taDays;ins.turnaround_not_stated=false;}else{ins.turnaround_not_stated=true;}if(p.descriptionScraped){ins.description_scraped=p.descriptionScraped;ins.description=p.descriptionScraped;ins.description_source="scraped_verbatim";ins.description_generated_at=new Date().toISOString();}const {error}=await supabase.from("provider_tests").insert(ins);if(!error)inserted++;}
    }
  }
  try{await supabase.from("scrape_runs").insert({provider_id:PROVIDER,scraper_function:"mhc-randox-scrape",started_at:startedAt,finished_at:new Date().toISOString(),status:"success",tests_seen:slice.length,tests_new:inserted,tests_updated:updated,tests_deactivated:0,tests_unchanged:Math.max(0,slice.length-inserted-updated-redir),errors:[],metadata:{total_product_urls:urls.length,existing_active:rows?.length||0,redirected_skipped:redir,skipped_no_name_or_price:skippedNoNameOrPrice.length,offset,limit,dry}});}catch(_e){/* logging must never block the scrape response */}
  return new Response(JSON.stringify({ok:true,provider:PROVIDER,dry,total_product_urls:urls.length,existing_active:rows?.length||0,processed:slice.length,updated,inserted,new_count:newItems.length,redirected_skipped:redir,skipped_no_name_or_price:skippedNoNameOrPrice.slice(0,10),new_items:newItems.slice(0,30)},null,2),{headers:{"content-type":"application/json"}});
});
