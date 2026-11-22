import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RecommendationEngine from "@/components/ai/RecommendationEngine";

const RecommendationsPage = () => {
  return (
    <>

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <h1 className="type-page-title px-4 pt-8 text-center text-brand-navy">Your test recommendations</h1>
          <RecommendationEngine surface="recommendations_page" />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default RecommendationsPage;
