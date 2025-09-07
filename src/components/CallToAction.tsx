import { Button } from "@/components/ui/button";
const CallToAction = () => {
  return <section className="py-16 bg-[#1a1b34]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-[#e70d69]">
            Take Control of Your Health Today
          </h2>
          <p className="text-xl mb-8 text-white/90 my-0 py-[20px]">
            Join thousands of customers who've discovered health insights that made a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white hover:bg-gray-100 text-[#e70d69] text-center font-normal rounded-md">Find Your Test With Ease </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Learn About Subscriptions
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default CallToAction;