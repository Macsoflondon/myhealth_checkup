
import React, { useState, useEffect } from 'react';
import { Search, Brain, TrendingUp, Clock, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'test' | 'symptom' | 'category';
  provider?: string;
  price?: number;
  popularity: number;
}

interface SearchResult {
  id: string;
  name: string;
  provider: string;
  price: number;
  category: string;
  relevanceScore: number;
  isAiRecommended?: boolean;
}

const IntelligentSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const popularSearches = [
    "Thyroid function",
    "Vitamin D",
    "Full blood count",
    "Hormone levels",
    "Cholesterol",
    "Diabetes screening",
    "Iron deficiency",
    "Liver function"
  ];

  const mockSuggestions: SearchSuggestion[] = [
    {
      id: '1',
      title: 'Thyroid Function Test',
      type: 'test',
      provider: 'Thriva',
      price: 59,
      popularity: 95
    },
    {
      id: '2',
      title: 'Fatigue and tiredness',
      type: 'symptom',
      popularity: 87
    },
    {
      id: '3',
      title: 'Hormone Health',
      type: 'category',
      popularity: 92
    }
  ];

  const mockResults: SearchResult[] = [
    {
      id: '1',
      name: 'Advanced Thyroid Function',
      provider: 'Medichecks',
      price: 79,
      category: 'Hormone Tests',
      relevanceScore: 98,
      isAiRecommended: true
    },
    {
      id: '2',
      name: 'Thyroid Function Test',
      provider: 'Thriva',
      price: 59,
      category: 'Hormone Tests',
      relevanceScore: 95
    },
    {
      id: '3',
      name: 'Complete Thyroid Check',
      provider: 'Blue Horizon',
      price: 89,
      category: 'Hormone Tests',
      relevanceScore: 89
    }
  ];

  useEffect(() => {
    if (searchTerm.length > 2) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSearch = async (term: string = searchTerm) => {
    if (!term.trim()) return;
    
    setIsLoading(true);
    setShowSuggestions(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const filtered = mockResults.filter(result =>
      result.name.toLowerCase().includes(term.toLowerCase()) ||
      result.category.toLowerCase().includes(term.toLowerCase())
    );
    
    setResults(filtered);
    setIsLoading(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.title);
    handleSearch(suggestion.title);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setShowSuggestions(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Your Perfect Health Test</h1>
        <p className="text-gray-600">
          Search by test name, symptoms, or health goals. Our AI will help you find the most relevant options.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for tests, symptoms, or health concerns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 pr-20 py-6 text-lg text-gray-900 bg-white placeholder:text-gray-500"
          />
          {searchTerm && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearSearch}
              className="absolute right-12 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          <Button
            onClick={() => handleSearch()}
            disabled={!searchTerm.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-health-600 hover:bg-health-700"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-10 p-2 bg-white border border-gray-200 shadow-lg">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded text-gray-900"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {suggestion.type === 'test' && <Search className="h-4 w-4 text-health-600" />}
                    {suggestion.type === 'symptom' && <Brain className="h-4 w-4 text-purple-600" />}
                    {suggestion.type === 'category' && <Filter className="h-4 w-4 text-blue-600" />}
                    <span className="font-medium">{suggestion.title}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {suggestion.type}
                  </Badge>
                </div>
                {suggestion.price && (
                  <span className="text-sm font-medium text-health-600">
                    £{suggestion.price}
                  </span>
                )}
              </div>
            ))}
          </Card>
        )}
      </div>

      {/* Popular Searches */}
      {!searchTerm && !results.length && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-health-600" />
            <h2 className="text-lg font-semibold">Popular Searches</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((search, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-3 py-2 cursor-pointer hover:bg-health-50 hover:border-health-200"
                onClick={() => {
                  setSearchTerm(search);
                  handleSearch(search);
                }}
              >
                {search}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-health-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for the best options...</p>
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && !isLoading && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">
              {results.length} results for "{searchTerm}"
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="border rounded px-3 py-1 text-sm">
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {results.map((result) => (
              <Card key={result.id} className="p-4 hover:shadow-md transition-shadow bg-white border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{result.name}</h3>
                      {result.isAiRecommended && (
                        <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                          <Brain className="h-3 w-3" />
                          AI Recommended
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{result.provider}</span>
                      <span>•</span>
                      <span>{result.category}</span>
                      <span>•</span>
                      <span>{result.relevanceScore}% match</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-health-600 mb-2">
                      £{result.price}
                    </div>
                    <Button size="sm" className="bg-health-600 hover:bg-health-700">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {results.length === 0 && searchTerm && !isLoading && (
        <div className="text-center py-8">
          <div className="mb-4">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-navy">No exact matches found</h3>
            <p className="text-gray-600">
              Try searching for related terms or browse our popular categories
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {popularSearches.slice(0, 4).map((search, index) => (
              <Button
                key={index}
                variant="default"
                size="sm"
                className="bg-[#22c0d4] text-white"
                onClick={() => {
                  setSearchTerm(search);
                  handleSearch(search);
                }}
              >
                {search}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IntelligentSearch;
