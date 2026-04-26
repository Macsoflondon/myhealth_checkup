# Component Structure Migration Guide

## Overview

This guide documents the component reorganization refactoring completed on the myhealth checkup platform. Components have been reorganized into logical subdirectories for better maintainability and scalability.

---

## New Directory Structure

```
src/components/
├── layout/              # Layout components (Header, Footer)
│   ├── Header.tsx
│   └── Footer.tsx
├── common/              # Shared utility components
│   ├── ErrorBoundary.tsx
│   ├── ScrollToTop.tsx
│   ├── BackToTop.tsx
│   ├── LazyImage.tsx
│   ├── FastLazyImage.tsx
│   ├── OptimizedLazyImage.tsx
│   ├── OptimisticUpdateIndicator.tsx
│   ├── RealtimeSyncIndicator.tsx
│   └── OfflineSyncIndicator.tsx
├── sections/            # Page section components
│   ├── Hero.tsx
│   ├── NewHero.tsx
│   ├── EnhancedHero.tsx
│   ├── EnhancedSearchHero.tsx
│   ├── TestCategories.tsx
│   ├── FeaturedTests.tsx
│   ├── FeaturedProviders.tsx
│   ├── Testimonials.tsx
│   ├── CallToAction.tsx
│   ├── NationwideClinics.tsx
│   ├── AccreditationLogos.tsx
│   └── HowItWorks.tsx
├── header/              # Header subcomponents
├── compare/             # Comparison feature components
├── compliance/          # Compliance-related components
├── dashboard/           # Dashboard feature components
├── auth/                # Authentication components
└── ui/                  # shadcn/ui components
```

---

## Import Path Conventions

### ✅ Use Absolute Imports (Recommended)

Always use the `@/` alias for imports across the codebase:

```typescript
// ✅ CORRECT - Absolute imports
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import NewHero from "@/components/sections/NewHero";
import cqcLogo from "@/assets/compliance/cqc-logo.png";
```

### ❌ Avoid Relative Imports

Relative imports are harder to maintain and break when files move:

```typescript
// ❌ WRONG - Relative imports
import Header from "../components/Header";
import Footer from "../../components/Footer";
import cqcLogo from "../assets/compliance/cqc-logo.png";
```

---

## Migration Checklist

### For Layout Components (Header, Footer)

**Old Path:**
```typescript
import Header from "@/components/Header";
import Footer from "@/components/Footer";
```

**New Path:**
```typescript
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
```

### For Common Utility Components

**Old Path:**
```typescript
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ScrollToTop } from "./components/ScrollToTop";
```

**New Path:**
```typescript
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import ScrollToTop from "@/components/common/ScrollToTop";
```

### For Section Components

**Old Path:**
```typescript
import NewHero from "@/components/NewHero";
import CallToAction from "@/components/CallToAction";
import NationwideClinics from "@/components/NationwideClinics";
import HowItWorks from "@/components/HowItWorks";
```

**New Path:**
```typescript
import NewHero from "@/components/sections/NewHero";
import CallToAction from "@/components/sections/CallToAction";
import NationwideClinics from "@/components/sections/NationwideClinics";
import HowItWorks from "@/components/sections/HowItWorks";
```

### For Asset Imports

**Old Path (if inside moved component):**
```typescript
import cqcLogo from "../assets/compliance/cqc-logo.png";
```

**New Path:**
```typescript
import cqcLogo from "@/assets/compliance/cqc-logo.png";
```

---

## Barrel Export File

A barrel export file exists at `src/components/index.ts` for commonly used components:

```typescript
// You can import from the barrel
import { Header, Footer, ErrorBoundary } from "@/components";

// Or directly from the source (recommended for clarity)
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
```

---

## Component Categories Explained

### **layout/** - Structural Layout Components
Components that define the main structure of pages (navigation, footer, sidebars).

**Examples:** Header, Footer

### **common/** - Shared Utility Components
Reusable components used across multiple features and pages.

**Examples:** ErrorBoundary, ScrollToTop, BackToTop, LazyImage, OptimisticUpdateIndicator

### **sections/** - Page Section Components
Large section components typically used once per page (hero sections, CTAs, testimonials).

**Examples:** Hero variants, TestCategories, FeaturedProviders, CallToAction, NationwideClinics

### **header/** - Header Subcomponents
Components that are exclusively used within the Header component.

**Examples:** Logo, SearchBar, NavigationItems, UserMenu, MobileMenu

### **compare/** - Comparison Feature
Components specific to the test comparison functionality.

**Examples:** CompareFilters, ComparisonPanel, ModernCompareTable

### **compliance/** - Compliance & Legal
Components related to legal compliance, policies, and disclosures.

**Examples:** CookieConsent, PrivacyPolicy, AffiliateDisclosure

### **dashboard/** - Dashboard Feature
Components specific to the user dashboard and health data management.

**Examples:** HealthDataHub, ProfileSettings, TestResultsTimeline

### **auth/** - Authentication
Components related to user authentication flows.

**Examples:** GoogleSignInButton, ProtectedRoute, PasswordStrengthIndicator

### **ui/** - UI Primitives
shadcn/ui component library (buttons, dialogs, forms, etc.)

---

## Best Practices

### 1. **Always Use Absolute Imports**
```typescript
// ✅ Good
import Header from "@/components/layout/Header";
import cqcLogo from "@/assets/compliance/cqc-logo.png";

// ❌ Bad
import Header from "../../components/layout/Header";
import cqcLogo from "../../../assets/compliance/cqc-logo.png";
```

### 2. **Create Small, Focused Components**
Avoid creating monolithic components. Break complex UIs into smaller, reusable pieces.

### 3. **Follow Component Naming Conventions**
- Use PascalCase for component files: `UserMenu.tsx`, `CallToAction.tsx`
- Use descriptive names that indicate purpose: `OptimisticUpdateIndicator`, not `Indicator`

### 4. **Organize Imports Consistently**
```typescript
// 1. External dependencies
import React from "react";
import { Link } from "react-router-dom";

// 2. Internal components
import Header from "@/components/layout/Header";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// 3. UI components
import { Button } from "@/components/ui/button";

// 4. Hooks and utilities
import { useAuth } from "@/hooks/useAuth";

// 5. Types
import type { User } from "@/types/entities";

// 6. Assets
import logo from "@/assets/logo.png";

// 7. Styles (if any)
import styles from "./Component.module.css";
```

### 5. **Place Components in the Correct Directory**
- Is it used on every page? → `layout/`
- Is it reusable across features? → `common/`
- Is it a large page section? → `sections/`
- Is it feature-specific? → Feature directory (e.g., `compare/`, `dashboard/`)

---

## Troubleshooting

### "Cannot find module" Errors

If you see import errors after the migration:

1. **Check the import path** - Ensure you're using the new directory structure
2. **Use absolute imports** - Replace relative paths with `@/` alias
3. **Verify file location** - Confirm the component exists in the expected directory
4. **Check for typos** - Component names are case-sensitive

### Asset Import Errors

If asset imports fail:

```typescript
// ❌ Wrong - Relative path may break when component moves
import logo from "../assets/logo.png";

// ✅ Correct - Absolute path always works
import logo from "@/assets/logo.png";
```

---

## Future Considerations

### When Adding New Components

1. **Determine the category** - Is it layout, common, section, or feature-specific?
2. **Place in correct directory** - Follow the structure outlined above
3. **Use absolute imports** - Always use `@/` alias
4. **Keep components focused** - Single responsibility principle
5. **Update barrel export if needed** - Add to `src/components/index.ts` if frequently used

### Refactoring Existing Components

When refactoring or moving components:

1. **Move the file** to the appropriate directory
2. **Update import paths** in the component itself (especially assets)
3. **Find and update all imports** of that component across the codebase
4. **Test thoroughly** to ensure nothing breaks

---

## Questions or Issues?

For questions about this migration or the component structure, please:

1. Review this guide thoroughly
2. Check the existing codebase for examples
3. Consult with the team lead
4. Refer to the [Lovable Documentation](https://docs.lovable.dev/)

---

**Last Updated:** 2025-11-11  
**Migration Completed By:** AI Refactoring Agent  
**Status:** ✅ Complete
