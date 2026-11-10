import React, { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, Filter, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/Header";

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  testName: string;
  provider: string;
  review: string;
  verified: boolean;
  helpful: number;
  tags: string[];
}

const ReviewSystem = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const mockReviews: Review[] = [
    {
      id: "1",
      userName: "Sarah M.",
      rating: 5,
      date: "2024-01-15",
      testName: "Full Health MOT",
      provider: "Medichecks",
      review:
        "Excellent service! The at-home kit was easy to use and results came back quickly with clear explanations. The GP review call was very helpful.",
      verified: true,
      helpful: 23,
      tags: ["fast-results", "clear-explanation", "good-value"],
    },
    {
      id: "3",
      userName: "Kristijan G.",
      rating: 5,
      date: "2024-01-08",
      testName: "Vitamin D Test",
      provider: "Medichecks",
      review:
        "Quick and affordable. Perfect for routine monitoring. Clinic staff were professional and friendly.",
      verified: true,
      helpful: 15,
      tags: ["affordable", "quick", "professional-staff"],
    },
    {
      id: "4",
      userName: "Jackie O.",
      rating: 5,
      date: "2024-01-05",
      testName: "Blood Tests Comparison",
      provider: "myhealth checkup",
      review:
        "I compared five different thyroid panels in under two minutes. Prices, biomarkers, turnaround time — all in one place. I wish I had found this sooner.",
      verified: true,
      helpful: 12,
      tags: ["comprehensive", "good-value", "fast-results"],
    },
    {
      id: "5",
      userName: "Tiago L.",
      rating: 5,
      date: "2024-01-03",
      testName: "Blood Tests Comparison",
      provider: "myhealth checkup",
      review:
        "Knowing every provider listed uses UKAS-accredited labs made my decision straightforward. I did not have to second-guess the quality.",
      verified: true,
      helpful: 9,
      tags: ["professional-staff", "comprehensive"],
    },
    {
      id: "6",
      userName: "Italo O.",
      rating: 5,
      date: "2023-12-28",
      testName: "Health Quiz",
      provider: "myhealth checkup",
      review:
        "The health quiz narrowed down exactly which blood test matched my concerns. No account required, no pressure — just clear information.",
      verified: true,
      helpful: 8,
      tags: ["quick", "clear-explanation"],
    },
    {
      id: "7",
      userName: "Nathanial S.",
      rating: 5,
      date: "2023-12-21",
      testName: "Full Body MOT Comparison",
      provider: "myhealth checkup",
      review:
        "Other sites buried the total cost behind add-ons. Here, the pricing was upfront and honest. That transparency earned my trust.",
      verified: true,
      helpful: 11,
      tags: ["good-value", "clear-explanation"],
    },
    {
      id: "8",
      userName: "Kristijan G.",
      rating: 5,
      date: "2023-12-18",
      testName: "Hormone Panel Comparison",
      provider: "myhealth checkup",
      review:
        "As a first-timer, I had no idea where to start. The side-by-side comparison made it simple to understand what each test actually covers.",
      verified: true,
      helpful: 7,
      tags: ["comprehensive", "clear-explanation"],
    },
    {
      id: "9",
      userName: "Liam D.",
      rating: 5,
      date: "2023-12-12",
      testName: "Vitamin Testing",
      provider: "myhealth checkup",
      review:
        "Completely free, no sign-up, and genuinely independent. I have recommended it to everyone in my family.",
      verified: true,
      helpful: 6,
      tags: ["good-value", "quick"],
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getFilteredReviews = () => {
    let filtered = mockReviews;

    if (selectedFilter !== "all") {
      filtered = filtered.filter((review) =>
        review.tags.includes(selectedFilter),
      );
    }

    return filtered.sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "helpful") {
        return b.helpful - a.helpful;
      } else if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      return 0;
    });
  };

  const averageRating =
    mockReviews.reduce((sum, review) => sum + review.rating, 0) /
    mockReviews.length;

  return (
    <>
      <Header />
      <div className="bg-white">
      <div className="max-w-4xl mx-auto p-6 text-[#081129]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Customer reviews</h1>

          {/* Review Summary */}
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-health-600 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(averageRating))}
                </div>
                <div className="text-sm text-brand-navy">
                  Based on {mockReviews.length} reviews
                </div>
              </div>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = mockReviews.filter(
                    (r) => r.rating === rating,
                  ).length;
                  const percentage = (count / mockReviews.length) * 100;
                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm w-8">{rating}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-brand-navy w-8">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm">95% would recommend</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">4.2 avg. service rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">89% positive feedback</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Filters and Sort */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-brand-navy" />
              <span className="text-sm font-medium">Filter by:</span>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="all">All Reviews</option>
                <option value="fast-results">Fast results</option>
                <option value="good-value">Good Value</option>
                <option value="comprehensive">Comprehensive</option>
                <option value="professional-staff">Professional Staff</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {getFilteredReviews().map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{review.userName}</span>
                    {review.verified && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-50 text-green-700"
                      >
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-sm text-brand-navy">
                      {new Date(review.date).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                  <div className="text-sm text-brand-navy mb-2">
                    {review.testName} - {review.provider}
                  </div>
                </div>
              </div>

              <p className="text-brand-navy mb-4">{review.review}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {review.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag.replace("-", " ")}
                  </Badge>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-brand-navy">
                  {review.helpful} people found this helpful
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    Helpful
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ThumbsDown className="h-3 w-3" />
                    Not Helpful
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      </div>
    </>
  );
};

export default ReviewSystem;
