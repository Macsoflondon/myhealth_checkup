#!/usr/bin/env python3
"""
Script to document all import path transformations
Applied during component reorganization refactoring
"""

import_transformations = {
    # Layout components
    "from '@/components/Header'": "from '@/components/layout/Header'",
    'from "@/components/Header"': 'from "@/components/layout/Header"',
    
    "from '@/components/Footer'": "from '@/components/layout/Footer'",
    'from "@/components/Footer"': 'from "@/components/layout/Footer"',
    
    # Common components
    "from '@/components/ErrorBoundary'": "from '@/components/common/ErrorBoundary'",
    'from "@/components/ErrorBoundary"': 'from "@/components/common/ErrorBoundary"',
    
    # Section components
    "from '@/components/NewHero'": "from '@/components/sections/NewHero'",
    'from "@/components/NewHero"': 'from "@/components/sections/NewHero"',
    
    "from '@/components/CallToAction'": "from '@/components/sections/CallToAction'",
    'from "@/components/CallToAction"': 'from "@/components/sections/CallToAction"',
    
    "from '@/components/NationwideClinics'": "from '@/components/sections/NationwideClinics'",
    'from "@/components/NationwideClinics"': 'from "@/components/sections/NationwideClinics"',
    
    "from '@/components/HowItWorks'": "from '@/components/sections/HowItWorks'",
    'from "@/components/HowItWorks"': 'from "@/components/sections/HowItWorks"',
    
    "from '@/components/FeaturedProviders'": "from '@/components/sections/FeaturedProviders'",
    'from "@/components/FeaturedProviders"': 'from "@/components/sections/FeaturedProviders"',
}

print("Applied import transformations:")
for old, new in import_transformations.items():
    print(f"  {old} -> {new}")
