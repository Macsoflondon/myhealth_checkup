import { Card, CardContent } from "@/components/ui/card";
const FounderStory = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
              Founded with a mission to make health testing accessible and transparent for everyone across the UK.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
export default FounderStory;