
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompareTable from "@/components/CompareTable";
import TestFilter from "@/components/TestFilter";
import { compareCategories } from "@/data/compare/categories";

const CompareTests = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("blood-tests");
  const [selectedProviders, setSelectedProviders] = useState<string[]>(["all"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Parse query parameters from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");
    
    if (categoryParam && compareCategories.some(cat => cat.id === categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleProviderChange = (providers: string[]) => {
    setSelectedProviders(providers);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <section className="py-10 md:py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Compare Health Services</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Compare prices and features across multiple providers to find the best option for your health needs.
              </p>
            </div>
            
            <TestFilter
              selectedCategory={selectedCategory}
              selectedProviders={selectedProviders}
              onCategoryChange={handleCategoryChange}
              onProviderChange={handleProviderChange}
            />

            <div className="flex flex-wrap gap-4 mt-6">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search tests"
                className="border rounded px-3 py-2 w-full md:w-1/3"
              />
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="border rounded px-3 py-2 w-full md:w-1/3"
              >
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>
            
            <div className="mt-8">
              <CompareTable
                category={selectedCategory}
                providers={selectedProviders}
                searchTerm={searchTerm}
                sortOrder={sortOrder}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CompareTests;
