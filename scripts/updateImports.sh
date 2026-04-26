#!/bin/bash

# Script to update all imports from old @/components paths to new organized structure
# This is a reference script showing the transformations applied

# Layout components
find src/pages -name "*.tsx" -exec sed -i "s|from '@/components/Header'|from '@/components/layout/Header'|g" {} \;
find src/pages -name "*.tsx" -exec sed -i "s|from \"@/components/Header\"|from \"@/components/layout/Header\"|g" {} \;

find src/pages -name "*.tsx" -exec sed -i "s|from '@/components/Footer'|from '@/components/layout/Footer'|g" {} \;
find src/pages -name "*.tsx" -exec sed -i "s|from \"@/components/Footer\"|from \"@/components/layout/Footer\"|g" {} \;

# Common components
find src/pages -name "*.tsx" -exec sed -i "s|from '@/components/ErrorBoundary'|from '@/components/common/ErrorBoundary'|g" {} \;
find src/pages -name "*.tsx" -exec sed -i "s|from \"@/components/ErrorBoundary\"|from \"@/components/common/ErrorBoundary\"|g" {} \;

# Section components
find src/pages -name "*.tsx" -exec sed -i "s|from '@/components/NewHero'|from '@/components/sections/NewHero'|g" {} \;
find src/pages -name "*.tsx" -exec sed -i "s|from \"@/components/NewHero\"|from \"@/components/sections/NewHero\"|g" {} \;

find src/pages -name "*.tsx" -exec sed -i "s|from '@/components/CallToAction'|from '@/components/sections/CallToAction'|g" {} \;
find src/pages -name "*.tsx" -exec sed -i "s|from \"@/components/CallToAction\"|from \"@/components/sections/CallToAction\"|g" {} \;

find src/pages -name "*.tsx" -exec sed -i "s|from '@/components/NationwideClinics'|from '@/components/sections/NationwideClinics'|g" {} \;
find src/pages -name "*.tsx" -exec sed -i "s|from \"@/components/NationwideClinics\"|from \"@/components/sections/NationwideClinics\"|g" {} \;

find src/pages -name "*.tsx" -exec sed -i "s|from '@/components/HowItWorks'|from '@/components/sections/HowItWorks'|g" {} \;
find src/pages -name "*.tsx" -exec sed -i "s|from \"@/components/HowItWorks\"|from \"@/components/sections/HowItWorks\"|g" {} \;

find src/pages -name "*.tsx" -exec sed -i "s|from '@/components/FeaturedProviders'|from '@/components/sections/FeaturedProviders'|g" {} \;
find src/pages -name "*.tsx" -exec sed -i "s|from \"@/components/FeaturedProviders\"|from \"@/components/sections/FeaturedProviders\"|g" {} \;

echo "All imports updated successfully!"
