import { Button } from "@/components/ui/button";
const CallToAction = () => {
  return <section className="bg-[#1a1b34] text-center font-bold text-[#22c0d4] text-4xl py-0 my-[20px] -mt-[2cm]">
      <div className="container mx-auto px-4 mt-[2cm]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl mb-6 text-center font-semibold text-[#e70d69] md:text-lg">
            Take Control of Your Health Today
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of customers who've discovered health insights that made a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#e70d69] text-white hover:bg-[#e70d69]/90">
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