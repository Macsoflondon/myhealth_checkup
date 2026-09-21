// mhc-lml-scrape — myhealth checkup
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
const PROVIDER = "london-medical-laboratory";
function stripTags(s){return (s||"").replace(/<[^>]+>/g," ").replace(/&amp;/g,"&").replace(/&nbsp;/g," ").replace(/&#8211;|&ndash;/g,"-").replace(/&pound;/g,"£").replace(/\s+/g," ").trim();}
function slugRaw(u){return (u.replace(/[?#].*$/,"").replace(/\/+$/,"").split("/").pop()||"").toLowerCase();}
// 2026-09-01, v3: two rows' JSON-LD description values themselves contained
// embedded HTML (<p>, <strong>) as escaped text — a genuine, real description,
// just not plain text. Run it through stripTags too, not only the fallback
// path, so description_scraped is always plain text either way.
function extractJsonLdDescription(html){
  const matches=[...html.matchAll(/"description"\s*:\s*"((?:[^"\\]|\\.)*)"/gi)];
  let best=null;
  for(const m of matches){
    const val=m[1].replace(/\\\//g,"/").replace(/\\n/g," ").replace(/\\"/g,'"').replace(/\s+/g," ").trim();
    if(val.length>40 && (!best||val.length>best.length)) best=val;
  }
  return best && best.length>40 ? best.slice(0,4000) : null;
}
function extractDescriptionScraped(html,txt,title){
  const jsonLd=extractJsonLdDescription(html);
  if(jsonLd) return stripTags(jsonLd).slice(0,4000);
  let startIdx=0;
  if(title){const idx=txt.indexOf(title); if(idx>=0) startIdx=idx+title.length;}
  const landmarks=["Onsite Test","At Home Phlebotomy","Add to basket","Add to cart","Related products"];
  let endIdx=txt.length;
  for(const lm of landmarks){const i=txt.indexOf(lm,startIdx); if(i>=0 && i<endIdx) endIdx=i;}
  if(endIdx-startIdx>4500) endIdx=startIdx+4500;
  const slice=txt.slice(startIdx,endIdx).trim();
  return slice && slice.length>20 ? slice.slice(0,4000) : null;
}
function parsePage(html){
  let title=null; const og=html.match(/property="og:title"\s+content="([^"]+)"/i); if(og) title=og[1].split("|")[0].trim();
  if(!title){const t=html.match(/<title>([^<]+)<\/title>/i); if(t) title=t[1].split("|")[0].trim();}
  const cleanedHtml=html.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ");
  const txt=stripTags(cleanedHtml);
  let price=null; const pm=txt.match(/£\s*([\d,]+(?:\.\d{2})?)/); if(pm) price=parseFloat(pm[1].replace(/,/g,""));
  let taText=null,taDays=null;
  if(/next day results/i.test(txt)){taText="Next day results";taDays=1;}
  else{let m=txt.match(/(\d+)\s*(?:to|[-–])\s*(\d+)\s*working days/i); if(m){taDays=parseInt(m[2]);taText=`Results in ${m[1]}–${m[2]} working days`;} else{m=txt.match(/(\d+)\s*working days/i); if(m){taDays=parseInt(m[1]);taText=`Results in ${m[1]} working days`;}}}
  let sample=null; if(/finger-?prick/i.test(txt)) sample="Finger-prick or venous"; else if(/venous/i.test(txt)) sample="Venous";
  let clinicFee=null,homeFee=null; let cf=txt.match(/Onsite Test[^£]*£\s*([\d.]+)/i); if(cf) clinicFee=parseFloat(cf[1]); let hf=txt.match(/At Home Phlebotomy[^£]*£\s*([\d.]+)/i); if(hf) homeFee=parseFloat(hf[1]);
  const descriptionScraped=extractDescriptionScraped(html,txt,title);
  return {title,price,taText,taDays,sample,clinicFee,homeFee,descriptionScraped};
}
Deno.serve(async (req)=>{
  const u=new URL(req.url);
  if(u.searchParams.get("secret")!==SECRET) return new Response("unauthorized",{status:401});
  const startedAt=new Date().toISOString();
  const dry=u.searchParams.get("dry")==="1";
  const offset=parseInt(u.searchParams.get("offset")||"0"); const limit=parseInt(u.searchParams.get("limit")||"20");
  const supabase=createClient(Deno.env.get("SUPABASE_URL"),Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
  const {data:allActive}=await supabase.from("provider_tests").select("id,test_name,url").eq("provider_id",PROVIDER).eq("is_active",true);
  const rows=(allActive||[]).filter(r=>/\/product\//.test(r.url||""));
  const noCrawlableUrl=(allActive||[]).filter(r=>!/\/product\//.test(r.url||""));
  const slice=rows.slice(offset,offset+limit);
  const results=[]; let written=0,skipped=0;
  for(const row of slice){
    let html=""; let finalUrl=row.url; try{const r=await fetch(row.url,{headers:{"User-Agent":"myhealthcheckup-sync/1.0"}}); if(!r.ok){skipped++;continue;} finalUrl=r.url||row.url; html=await r.text();}catch(_e){skipped++;continue;}
    if(slugRaw(finalUrl)!==slugRaw(row.url)){skipped++; results.push({db_name:row.test_name,skipped:"redirect"}); continue;}
    const p=parsePage(html);
    if(!p.price||p.price<=0){skipped++; results.push({db_name:row.test_name,skipped:"no price"}); continue;}
    if(results.length<12) results.push({db_name:row.test_name,price:p.price,turnaround:p.taText,sample:p.sample,has_description:!!p.descriptionScraped});
    if(!dry){
      const upd={base_price:p.price,total_expected_cost:p.price,price:p.price,price_not_stated:false,scrape_source_url:row.url,url_verified:true,last_validated_at:new Date().toISOString()};
      if(p.taText){upd.turnaround_days_text=p.taText;upd.turnaround_days=p.taDays;upd.turnaround_not_stated=false;}
      if(p.sample) upd.sample_type=p.sample;
      if(p.clinicFee!=null) upd.clinic_phlebotomy_cost=p.clinicFee;
      if(p.homeFee!=null) upd.home_phlebotomy_cost=p.homeFee;
      if(p.descriptionScraped){upd.description_scraped=p.descriptionScraped;upd.description=p.descriptionScraped;upd.description_source="scraped_verbatim";upd.description_generated_at=new Date().toISOString();}
      const {error}=await supabase.from("provider_tests").update(upd).eq("id",row.id); if(!error) written++;
    }
  }
  const redirectRatio = slice.length ? skipped/slice.length : 0;
  const runStatus = (noCrawlableUrl.length>0 || redirectRatio>0.5) ? "partial" : "success";
  try{await supabase.from("scrape_runs").insert({provider_id:PROVIDER,scraper_function:"mhc-lml-scrape",started_at:startedAt,finished_at:new Date().toISOString(),status:runStatus,tests_seen:slice.length,tests_new:0,tests_updated:written,tests_deactivated:0,tests_unchanged:Math.max(0,slice.length-written-skipped),errors:[],metadata:{candidates:rows.length,skipped,offset,limit,dry,no_crawlable_url_count:noCrawlableUrl.length,no_crawlable_url_sample:noCrawlableUrl.slice(0,10).map(r=>({id:r.id,test_name:r.test_name,url:r.url}))}});}catch(_e){/* logging must never block the scrape response */}
  return new Response(JSON.stringify({ok:true,provider:PROVIDER,dry,candidates:rows.length,no_crawlable_url_count:noCrawlableUrl.length,processed:slice.length,written,skipped,sample:results},null,2),{headers:{"content-type":"application/json"}});
});
