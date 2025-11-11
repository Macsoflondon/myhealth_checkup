import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, ArrowRight } from 'lucide-react';
const HealthBlogPage = () => {
  const featuredArticles = [{
    title: "Understanding Your Vitamin D Levels: A Complete Guide",
    excerpt: "Learn about vitamin D deficiency symptoms, optimal levels, and how to improve your vitamin D status through testing and lifestyle changes.",
    author: "Dr. Sarah Johnson",
    readTime: "8 min read",
    category: "Nutrition",
    date: "March 15, 2024",
    image: "/lovable-uploads/blog-vitamin-d.jpg"
  }, {
    title: "Heart Health After 40: Key Tests You Should Consider",
    excerpt: "Discover essential cardiovascular screening tests for adults over 40, including cholesterol panels, cardiac risk assessments, and prevention strategies.",
    author: "Dr. Michael Chen",
    readTime: "12 min read",
    category: "Heart Health",
    date: "March 12, 2024",
    image: "/lovable-uploads/blog-heart-health.jpg"
  }, {
    title: "The Gut-Brain Connection: How Your Microbiome Affects Mental Health",
    excerpt: "Explore the fascinating link between gut health and mental wellbeing, plus actionable steps to improve both through targeted testing.",
    author: "Dr. Emma Williams",
    readTime: "10 min read",
    category: "Gut Health",
    date: "March 10, 2024",
    image: "/lovable-uploads/blog-gut-brain.jpg"
  }];
  const recentArticles = [{
    title: "Thyroid Function Tests: When and Why You Need Them",
    excerpt: "Understanding TSH, T3, T4 and thyroid antibodies for optimal thyroid health.",
    author: "Dr. James Wilson",
    readTime: "6 min read",
    category: "Hormones",
    date: "March 8, 2024"
  }, {
    title: "Diabetes Prevention: Early Detection Through HbA1c Testing",
    excerpt: "How regular HbA1c monitoring can help prevent type 2 diabetes.",
    author: "Dr. Lisa Brown",
    readTime: "7 min read",
    category: "Diabetes",
    date: "March 5, 2024"
  }, {
    title: "Cancer Screening Guidelines for UK Adults",
    excerpt: "Age-appropriate cancer screening recommendations and what tests to consider.",
    author: "Dr. Robert Taylor",
    readTime: "9 min read",
    category: "Cancer Screening",
    date: "March 3, 2024"
  }];
  const categories = ["All Articles", "Heart Health", "Nutrition", "Hormones", "Gut Health", "Cancer Screening", "Diabetes", "Mental Health", "Women's Health", "Men's Health"];
  return <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#22c0d4]">
                Health Resources
              </h1>
              <p className="text-xl mb-8 text-[#e70d69]">
                Expert insights, health tips, and the latest research on preventive healthcare 
                and health testing for UK adults aged 30-60.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="border-b my-0 py-0">
          <div className="container mx-auto px-4 my-[10px]">
            <div className="flex flex-wrap gap-2 justify-center bg-[#081129]">
              {categories.map((category, index) => <Button key={index} variant={index === 0 ? "default" : "outline"} size="sm" className="bg-[#e70d69] hover:bg-[#22c0d4] text-white text-center text-xs font-medium">
                  {category}
                </Button>)}
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        <section className="py-[64px]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-bold mb-4 text-[#22c0d4] text-4xl">Featured Articles</h2>
              <p className="text-xl text-[#e70d69]">Our most popular health and wellness content</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              {featuredArticles.map((article, index) => <Card key={index} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute top-4 left-4 z-10">{article.category}</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {article.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {article.readTime}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{article.date}</span>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Read More <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* Recent Articles */}
        <section className="py-16 bg-[#081129]">
          <div className="container mx-auto px-4 bg-[#081129]">
            <div className="text-center mb-12">
              <h2 className="font-bold mb-4 text-[#22c0d4] text-4xl">Recent Articles</h2>
              <p className="text-xl text-[#e70d69]">Stay up to date with the latest health insights</p>
            </div>
            <div className="max-w-4xl mx-auto space-y-6">
              {recentArticles.map((article, index) => <Card key={index} className="group cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-32 md:h-20 bg-muted rounded-lg flex-shrink-0" />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                          <span className="text-xs text-muted-foreground">{article.date}</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {article.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {article.readTime}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1">
                            Read More <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-[#22c0d4] text-center font-semibold">Stay Informed</CardTitle>
                <p className="text-muted-foreground">
                  Get the latest health insights and testing updates delivered to your inbox weekly.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input type="email" placeholder="Enter your email address" className="flex-grow px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
                  <Button>Subscribe</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  No spam, unsubscribe anytime. Privacy policy applies.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default HealthBlogPage;