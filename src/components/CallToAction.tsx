import { Button } from "@/components/ui/button";
const CallToAction = () => {
  return <section className="py-16 bg-[#081129]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-center text-[#22c0d4]">
            Take Control of Your Health Today
          </h2>
          <p className="text-xl mb-8 text-white/90 my-0 py-0">
            Join thousands of customers who've discovered health insights that made a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#e70d69] hover:bg-[#e70d69]/90 text-[#ffffff] text-center font-normal rounded-md">Find Your Test With Ease </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              With Over 300 Tests To Choose From
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default CallToAction;