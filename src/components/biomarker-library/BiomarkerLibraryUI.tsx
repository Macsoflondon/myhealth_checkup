import { useState, useMemo } from "react";
import { biomarkers, categories, categoryIcons, COLORS } from "./biomarkerData";

const RangeBar = ({ ranges, sex = "both" }: any) => {
  const data = ranges[sex] || ranges["both"] || ranges["male"] || ranges["female"];
  if (!data || data.phases || data.stages || data.ageRanges) return null;
  const segments: any[] = [];
  if (data.low) segments.push({ label: data.low.label || "Low", color: COLORS.low, bg: COLORS.lowBg });
  if (data.borderline) segments.push({ label: data.borderline.label || "Borderline", color: COLORS.warn, bg: COLORS.warnBg });
  if (data.normal) segments.push({ label: data.normal.label || "Normal", color: COLORS.normal, bg: COLORS.normalBg });
  if (data.optimal) segments.push({ label: data.optimal.label || "Optimal", color: COLORS.normal, bg: COLORS.normalBg });
  if (data.elevated) segments.push({ label: data.elevated.label || "Elevated", color: COLORS.warn, bg: COLORS.warnBg });
  if (data.high) segments.push({ label: data.high.label || "High", color: COLORS.high, bg: COLORS.highBg });
  if (data.veryHigh) segments.push({ label: data.veryHigh.label || "Very High", color: COLORS.high, bg: COLORS.highBg });
  if (!segments.length) return null;
  return (
    <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
      {segments.map((seg, i) => (
        <div key={i} style={{ flex: 1, background: seg.bg, borderLeft: i > 0 ? "2px solid #fff" : "none", padding: "8px 10px", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: seg.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>{seg.label}</div>
        </div>
      ))}
    </div>
  );
};

const BiomarkerCard = ({ biomarker, isExpanded, onToggle }: any) => {
  const [sexView, setSexView] = useState("both");
  const data = biomarker.ranges[sexView] || biomarker.ranges["both"] || biomarker.ranges["male"] || biomarker.ranges["female"];
  const hasSexSplit = biomarker.ranges.male && biomarker.ranges.female;
  return (
    <div style={{ background: "#fff", border: `1px solid ${isExpanded ? COLORS.accent : COLORS.border}`, borderRadius: 16, overflow: "hidden", transition: "all 0.2s", boxShadow: isExpanded ? "0 8px 32px rgba(34,192,212,0.10)" : "0 2px 6px rgba(8,17,41,0.05)" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "18px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: COLORS.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{biomarker.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: COLORS.navy, fontSize: 16 }}>{biomarker.name}</span>
            <span style={{ background: COLORS.navy + "12", color: COLORS.navy, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 800 }}>{biomarker.abbr}</span>
          </div>
          <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 3 }}>{biomarker.category} · {biomarker.unit}</div>
        </div>
        <div style={{ color: COLORS.accent, fontSize: 20, flexShrink: 0, transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</div>
      </button>
      {isExpanded && (
        <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "24px" }}>
          {hasSexSplit && (
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: COLORS.muted, lineHeight: "32px", marginRight: 4 }}>View ranges for:</span>
              {["male", "female"].map(s => (
                <button key={s} onClick={() => setSexView(s)} style={{ background: sexView === s ? COLORS.navy : COLORS.lightBg, color: sexView === s ? "#fff" : COLORS.text, border: "none", borderRadius: 8, padding: "6px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", textTransform: "capitalize" }}>
                  {s === "male" ? "♂ Male" : "♀ Female"}
                </button>
              ))}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            <div>
              <h4 style={{ color: COLORS.accent, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>What It Measures</h4>
              <p style={{ color: COLORS.text, lineHeight: 1.75, fontSize: 14 }}>{biomarker.what}</p>
            </div>
            <div>
              <h4 style={{ color: COLORS.accent, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Why It Matters</h4>
              <p style={{ color: COLORS.text, lineHeight: 1.75, fontSize: 14 }}>{biomarker.why}</p>
            </div>
          </div>
          <h4 style={{ color: COLORS.accent, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>Reference Ranges</h4>
          {data?.phases && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 8, marginBottom: 16 }}>
              {data.phases.map((p: any, i: number) => (
                <div key={i} style={{ background: COLORS.lightBg, borderRadius: 10, padding: "10px 14px" }}>
                  <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 13 }}>{p.phase}</div>
                  <div style={{ color: COLORS.accent, fontWeight: 800, fontSize: 14 }}>{p.range}</div>
                </div>
              ))}
            </div>
          )}
          {data?.stages && (
            <div style={{ marginBottom: 16 }}>
              {data.stages.map((s: any, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, background: COLORS.lightBg, borderRadius: 10, padding: "10px 14px", marginBottom: 6 }}>
                  <span style={{ fontWeight: 800, color: COLORS.navy, fontSize: 13, minWidth: 130 }}>{s.stage}: {s.range}</span>
                  <span style={{ color: COLORS.muted, fontSize: 13 }}>{s.meaning}</span>
                </div>
              ))}
            </div>
          )}
          {data?.ageRanges && (
            <div style={{ overflowX: "auto", marginBottom: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
                <thead><tr style={{ background: COLORS.lightBg }}>{["Age Group","Normal","Borderline","Elevated"].map(h => <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontSize: 12, color: COLORS.muted, fontWeight: 700 }}>{h}</th>)}</tr></thead>
                <tbody>{data.ageRanges.map((row: any, i: number) => (
                  <tr key={i} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: "10px 14px", fontWeight: 700, color: COLORS.navy, fontSize: 13 }}>{row.range}</td>
                    <td style={{ padding: "10px 14px", color: COLORS.normal, fontWeight: 700, fontSize: 13 }}>{row.normal}</td>
                    <td style={{ padding: "10px 14px", color: COLORS.warn, fontWeight: 700, fontSize: 13 }}>{row.borderline}</td>
                    <td style={{ padding: "10px 14px", color: COLORS.high, fontWeight: 700, fontSize: 13 }}>{row.high}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
          {!data?.phases && !data?.stages && !data?.ageRanges && <RangeBar ranges={biomarker.ranges} sex={sexView === "both" ? (biomarker.ranges.male ? "male" : "both") : sexView} />}
          {data && !data?.phases && !data?.stages && !data?.ageRanges && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10, marginBottom: 20 }}>
              {["low","borderline","normal","optimal","elevated","high","veryHigh"].map(key => {
                if (!data[key]) return null;
                const r = data[key];
                const colorMap: any = { low: COLORS.low, borderline: COLORS.warn, normal: COLORS.normal, optimal: COLORS.normal, elevated: COLORS.warn, high: COLORS.high, veryHigh: COLORS.high };
                const bgMap: any = { low: COLORS.lowBg, borderline: COLORS.warnBg, normal: COLORS.normalBg, optimal: COLORS.normalBg, elevated: COLORS.warnBg, high: COLORS.highBg, veryHigh: COLORS.highBg };
                return (
                  <div key={key} style={{ background: bgMap[key], border: `1px solid ${colorMap[key]}30`, borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, color: colorMap[key], fontSize: 13 }}>{r.label || key}</span>
                      <span style={{ fontWeight: 700, color: colorMap[key], fontSize: 13 }}>{r.range}</span>
                    </div>
                    {r.meaning && <p style={{ color: COLORS.text, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{r.meaning}</p>}
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ background: COLORS.accentLight, border: `1px solid ${COLORS.accent}25`, borderRadius: 12, padding: "16px 20px", marginBottom: 20 }}>
            <h4 style={{ color: COLORS.navy, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>💡 What to Know</h4>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {biomarker.tips.map((tip: string, i: number) => <li key={i} style={{ color: COLORS.text, fontSize: 13, lineHeight: 1.7, marginBottom: i < biomarker.tips.length - 1 ? 6 : 0 }}>{tip}</li>)}
            </ul>
          </div>
          <div>
            <h4 style={{ color: COLORS.muted, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Related Tests</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {biomarker.relatedTests.map((t: string) => (
                <span key={t} style={{ background: COLORS.navy + "10", color: COLORS.navy, border: `1px solid ${COLORS.navy}20`, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 20, padding: "10px 14px", background: "#fff8ed", border: "1px solid #fde68a", borderRadius: 10 }}>
            <p style={{ color: "#92400e", fontSize: 12, margin: 0 }}>⚕️ Reference ranges are for guidance only. Always discuss your results with a qualified healthcare professional.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function BiomarkerLibraryUI() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const filtered = useMemo(() => biomarkers.filter((b: any) => {
    const matchCat = selectedCategory === "All" || b.category === selectedCategory;
    const matchSearch = !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.abbr.toLowerCase().includes(searchQuery.toLowerCase()) || b.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  }), [selectedCategory, searchQuery]);
  const grouped = useMemo(() => {
    const g: Record<string, any[]> = {};
    filtered.forEach((b: any) => { if (!g[b.category]) g[b.category] = []; g[b.category].push(b); });
    return g;
  }, [filtered]);
  return (
    <div style={{ fontFamily: "'Lato','Helvetica Neue',sans-serif", background: COLORS.lightBg, minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;600;700&display=swap');`}</style>
      <div style={{ background: `linear-gradient(135deg,${COLORS.navy} 0%,#0d2348 60%,#091a3a 100%)`, padding: "56px 24px 64px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,192,212,0.12)", border: "1px solid rgba(34,192,212,0.25)", borderRadius: 20, padding: "5px 14px", marginBottom: 20 }}>
            <span style={{ color: COLORS.accent, fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>myhealth checkup · Biomarker Library</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", color: "#fff", fontSize: "clamp(28px,5vw,52px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 16 }}>The Complete Biomarker<br /><span style={{ color: COLORS.accent }}>Reference Library</span></h1>
          <p style={{ color: "#8fa3bf", fontSize: "clamp(14px,2vw,18px)", lineHeight: 1.7, maxWidth: 640, marginBottom: 36 }}>Understand exactly what every blood test marker means — written in plain English, grounded in clinical evidence.</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[`${biomarkers.length} Biomarkers`, `${categories.length - 1} Categories`, "Sex-Specific Ranges", "Clinical Tips"].map(stat => (
              <div key={stat} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: COLORS.accent, fontSize: 16 }}>✓</span>
                <span style={{ color: "#c8d8e8", fontSize: 14, fontWeight: 600 }}>{stat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: "#fff", borderBottom: `1px solid ${COLORS.border}`, padding: "16px 24px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(8,17,41,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 220px" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: COLORS.accent }}>🔍</span>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search biomarkers... e.g. Haemoglobin, TSH, ALT" style={{ width: "100%", padding: "10px 12px 10px 38px", border: `1px solid ${COLORS.border}`, borderRadius: 10, fontSize: 14, outline: "none", color: COLORS.navy }} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {categories.map((cat: string) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ background: selectedCategory === cat ? COLORS.navy : COLORS.lightBg, color: selectedCategory === cat ? "#fff" : COLORS.text, border: `1px solid ${selectedCategory === cat ? COLORS.navy : COLORS.border}`, borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                {(categoryIcons as any)[cat]} {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px 4px" }}>
        <p style={{ color: COLORS.muted, fontSize: 13 }}>Showing <strong style={{ color: COLORS.navy }}>{filtered.length}</strong> biomarkers{selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}{searchQuery ? ` matching "${searchQuery}"` : ""}</p>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 24px 64px" }}>
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: `2px solid ${COLORS.accent}30` }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{(categoryIcons as any)[category]}</div>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", color: COLORS.navy, fontSize: "clamp(18px,3vw,26px)", fontWeight: 700 }}>{category}</h2>
                <span style={{ color: COLORS.muted, fontSize: 13 }}>{items.length} biomarker{items.length > 1 ? "s" : ""}</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((b: any) => <BiomarkerCard key={b.id} biomarker={b} isExpanded={expandedId === b.id} onToggle={() => setExpandedId(expandedId === b.id ? null : b.id)} />)}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔬</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", color: COLORS.navy, fontSize: 22, marginBottom: 8 }}>No biomarkers found</h3>
            <button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }} style={{ marginTop: 20, background: COLORS.accent, color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, cursor: "pointer" }}>Reset Filters</button>
          </div>
        )}
      </div>
      <div style={{ background: COLORS.navy, padding: "32px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#8fa3bf", fontSize: 13, lineHeight: 1.8 }}>⚕️ <strong style={{ color: "#c8d8e8" }}>Medical Disclaimer:</strong> This library is for educational purposes only and does not constitute medical advice. Always discuss results with a qualified healthcare professional.</p>
          <p style={{ color: "#4a6480", fontSize: 12, marginTop: 12 }}>© 2025 myhealth checkup Ltd · {biomarkers.length} biomarkers across {categories.length - 1} categories</p>
        </div>
      </div>
    </div>
  );
}
