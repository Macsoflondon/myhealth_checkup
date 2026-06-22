Compact card CTA only in `src/components/sections/HeroSalesTestCard.tsx`:

- Shrink button: `px-5 py-3` → `px-3 py-1.5`, text `text-[15px]` → `text-[11px]`
- Background: navy gradient → provider colour (`background: providerColor`)
- Text colour: provider colour → navy `#081129`
- Tone down stacked shadow to match smaller size: `0 3px 0 0 ${hexToRgba(providerColor,0.5)}, 0 6px 12px ${hexToRgba(providerColor,0.25)}`
- Keep inner top highlight border

S3 upload errors are infra rate-limiting, not source issues — no code fix needed.