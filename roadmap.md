# Roadmap

- [ ] Delete 136 inactive £0–£1 medical-diagnosis junk rows (with their history snapshots)
- [ ] Guard `upsertWithProvenance` insert path: price ≤ £1 → insert inactive + `suspicious_price` warning
- [ ] Verify zero £≤1 rows remain; metrics clean
- [ ] Pull critical SOC incidents; diagnose and fix Medichecks + London Health Company recurring partial scrape runs
