import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Award, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
const EnhancedHero = () => {
  return <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="absolute inset-0 z-0 wave-pattern opacity-10"></div>
      
      <div className="container mx-auto px-4 py-20 sm:py-24 lg:py-32 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-health-100 text-health-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Trusted by 50,000+ Health-Conscious Adults Across the UK
            </div>
            
            <h1 className="text-4xl md:text-5xl mb-6 animate-fadeIn text-[#3a5f85] font-bold lg:text-6xl">
              Your Health Is Your Greatest Asset{" "}
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-health-600 to-wellness-600 text-3xl">
                Don't Wait For Symptoms To Appear Before You Take Action
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed animate-slideUp">
              Join thousands of proactive adults who've added <strong>healthy years to their lives</strong> through 
              early detection and prevention. Our hospital-grade tests, expert guidance, and comprehensive 
              provider comparisons make staying ahead of your health simple and affordable.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button className="text-lg px-8 py-6 bg-health-600 hover:bg-health-700 shadow-lg shadow-health-200/50">
                Find Your Perfect Test
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button variant="outline" className="text-lg px-8 py-6 border-health-300 text-health-700 hover:bg-health-50">
                Compare Providers
              </Button>
            </div>

            {/* Trust Indicators for Target Demographic */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-12">
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-2 text-health-600" />
                UKAS Accredited Labs
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-health-600" />
                Results in 24-48hrs
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-health-600" />
                Doctor Reviewed
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-health-600" />
                Family Health Planning
              </div>
            </div>
          </div>

          {/* Interactive Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-health-700 mb-2">85%</div>
                <p className="text-gray-600 text-sm">Health Issues Prevented Through Early Detection</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-wellness-700 mb-2">+12</div>
                <p className="text-gray-600 text-sm">Healthy Years Added on Average</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-700 mb-2">£2,400</div>
                <p className="text-gray-600 text-sm">Average Annual NHS Savings</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-amber-700 mb-2">96%</div>
                <p className="text-gray-600 text-sm">Customer Satisfaction Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Age-Specific Call-to-Action */}
          <div className="bg-gradient-to-r from-health-600 to-wellness-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Perfect for Adults 30-60 Who Value Their Health & Family's Future
            </h3>
            <p className="text-lg opacity-90 mb-6 max-w-3xl mx-auto">
              Whether you're planning for your family's future, managing career stress, or simply want to 
              stay ahead of age-related health changes, we have the right tests and guidance for your life stage.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-health-700 hover:bg-gray-100">
              Discover Tests for Your Age Group
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </div>;
};
export default EnhancedHero;