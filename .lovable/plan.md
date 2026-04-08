

## Plan: Translate "Health Resource Hub" Across All Locale Files

Update the `"blog"` key in both `navigation` and `footer.links` sections of each locale file with the appropriate translation.

### Translations

| Locale | Translation |
|--------|------------|
| fr | Centre de Ressources Santé |
| de | Gesundheits-Ressourcen |
| es | Centro de Recursos de Salud |
| it | Centro Risorse Salute |
| pt | Centro de Recursos de Saúde |
| nl | Gezondheidscentrum |
| pl | Centrum Zasobów Zdrowotnych |
| ar | مركز الموارد الصحية |
| zh | 健康资源中心 |
| ja | 健康リソースハブ |

### Files to edit (10 files, 1-2 lines each)

Each file gets the `"blog"` value updated in:
- `navigation.blog` (all files)
- `footer.links.blog` (fr, de, es, it, zh, ar, ja — the ones that have this key)

nl, pl, pt only have `navigation.blog` based on the current file structure.

