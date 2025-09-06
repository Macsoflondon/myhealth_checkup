import { Button } from "@/components/ui/button";
const CallToAction = () => {
  return <section className="bg-gradient-to-r from-health-600 to-wellness-600 bg-[#1a1b34] text-center font-bold text-[#22c0d4] text-4xl py-0 my-[20px]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl mb-6 text-center font-semibold text-[#e70d69] md:text-lg">
            Take Control of Your Health Today
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of customers who've discovered health insights that made a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-health-700 hover:bg-gray-100">
              Explore Tests
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Learn About Subscriptions
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default CallToAction;