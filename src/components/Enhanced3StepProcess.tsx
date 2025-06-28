
import { TestTube, Users, CheckCircle } from "lucide-react";

const Enhanced3StepProcess = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-health-600 to-wellness-600">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            3 Simple Steps to understand your health
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                <TestTube className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Step 1:</h3>
              <p className="text-lg opacity-90 leading-relaxed">
                Select your chosen health test or the health condition you would like to get tested for.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Step 2:</h3>
              <p className="text-lg opacity-90 leading-relaxed">
                We'll compare your selected health test from the leading providers, so you don't have to.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Step 3:</h3>
              <p className="text-lg opacity-90 leading-relaxed">
                Book your health test with confidence, knowing that you've picked the right test for you.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-lg opacity-90">
              Once you have booked your health test, you will be contacted by the provider, who will conduct the health test for you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Enhanced3StepProcess;
