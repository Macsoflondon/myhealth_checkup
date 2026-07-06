import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AlertCircle, Inbox, RotateCw } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CategoryStandardHero } from "@/components/category/CategoryStandardHero";
import CategoryPageBottom from "@/components/sections/CategoryPageBottom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ShellProps {
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  pillLabel: string;
  benefits: [Benefit, Benefit, Benefit];
  benefitsTitle: string;
  children: React.ReactNode;
}

export const CategoryStatusShell: React.FC<ShellProps> = ({
  seoTitle,
  seoDescription,
  canonicalUrl,
  pillLabel,
  benefits,
  benefitsTitle,
  children,
}) => (
  <>
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CategoryStandardHero pillLabel={pillLabel} benefits={benefits} />
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12 xl:px-16 bg-[#08122b] min-h-[60vh]">
          <div className="max-w-6xl mx-auto">{children}</div>
        </section>
        <CategoryPageBottom benefitsTitle={benefitsTitle} benefits={benefits} />
      </main>
      <Footer />
    </div>
  </>
);

export const CategoryLoadingSkeleton: React.FC = () => (
  <>
    <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full bg-white/10" />
        ))}
      </div>
      <Skeleton className="h-10 w-48 rounded-md bg-white/10" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="w-full max-w-[340px] h-[440px] rounded-2xl bg-white/10" />
      ))}
    </div>
  </>
);

export const CategoryErrorState: React.FC<{ onRetry: () => void; title?: string }> = ({
  onRetry,
  title = "Couldn't load tests",
}) => (
  <div className="text-center py-20 max-w-md mx-auto">
    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/15 mb-5">
      <AlertCircle className="h-7 w-7 text-destructive" />
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
    <p className="text-white/70 mb-6">
      Something went wrong while fetching the latest tests. Please check your connection and try again.
    </p>
    <Button onClick={onRetry} variant="secondary" className="gap-2">
      <RotateCw className="h-4 w-4" /> Retry
    </Button>
  </div>
);

export const CategoryEmptyState: React.FC<{ title?: string }> = ({
  title = "No tests available yet",
}) => (
  <div className="text-center py-20 max-w-md mx-auto">
    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-5">
      <Inbox className="h-7 w-7 text-white/70" />
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
    <p className="text-white/70 mb-6">
      We're updating our catalogue. Browse the full comparison hub to find the right test for you.
    </p>
    <Button asChild variant="secondary">
      <Link to="/compare">Browse all tests</Link>
    </Button>
  </div>
);
