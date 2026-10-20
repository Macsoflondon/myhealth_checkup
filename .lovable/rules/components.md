# Components

Component catalog for **myhealth checkup**. Import all components from `@ws-nbrthj08iodjydjjp2ox/37e227e1-0d67-4515-b064-99c243036534`.

### LiveCatalogueComparison

```ts
import { LiveCatalogueComparison } from "@ws-nbrthj08iodjydjjp2ox/37e227e1-0d67-4515-b064-99c243036534"
```

Show a compact provider comparison using source-backed prices, coverage and update timestamps.

**Props:**

| Prop | Type | Default |
|---|---|---|
| `panel` | any | `—` |
| `variant` | compact | `compact` |
| `size` | default | `default` |

**Examples:**

_Provider panel_
```tsx
<LiveCatalogueComparison panel={comparisonPanel} variant="compact" size="default" />
```

**Avoid:**

- Do not use screenshot images or invented prices as live catalogue data.
- Do not repeat the same health-test panel in simultaneous homepage slots.

