import { Card, CardContent } from "@/components/ui/card";
const FounderStory = (): JSX.Element => {
  return (
    <section className="py-16 bg-gradient-to-br from-wellness-50 to-health-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-health-700">Our Story</h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-lg text-gray-600 mb-6">
                Founded by healthcare professionals who experienced firsthand the frustration of 
                navigating the UK's private health testing landscape, myhealth checkup was born 
                from a simple belief: everyone deserves easy access to quality health information.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                After spending countless hours researching providers for our own families, we realized 
                there had to be a better way. We created this platform to save others the time and 
                confusion we experienced, bringing together the UK's most trusted testing providers 
                in one place.
              </p>
              <p className="text-lg text-gray-600">
                Today, we're proud to help thousands of people take control of their health through 
                informed choices and convenient access to quality testing services.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
export default FounderStory;