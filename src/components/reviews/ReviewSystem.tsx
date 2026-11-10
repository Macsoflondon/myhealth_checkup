import { Star, Quote } from "lucide-react";
import Header from "@/components/layout/Header";
import { testimonials } from "@/data/testimonials";

const renderStars = (count: number) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, index) => (
      <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" />
    ))}
  </div>
);

const ReviewSystem = () => {
  return (
    <>
      <Header />
      <div className="bg-white">
        <div className="max-w-4xl mx-auto p-6 text-brand-navy">
          <div className="mb-8">
            <h1 className="type-page-title mb-3">What people say about us</h1>
            <p className="type-body max-w-2xl">
              The same reviews shown in the "Trusted by users" section of our
              homepage, from people who used myhealth checkup to compare
              private blood tests.
            </p>
          </div>

          <div className="space-y-4">
            {testimonials.map((t) => (
              <article
                key={t.name}
                className="rounded-2xl border border-brand-turquoise/40 bg-white p-5 sm:p-6 shadow-sm"
              >
                <Quote className="w-6 h-6 text-brand-pink mb-3" />
                {renderStars(t.stars)}
                <p className="mt-3 text-brand-navy text-sm sm:text-base leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="mt-4 pt-4 border-t border-brand-pink">
                  <p className="font-heading font-semibold text-brand-navy text-sm">
                    {t.name}
                  </p>
                  <p className="text-brand-navy text-xs">{t.detail}</p>
                  <span className="inline-block mt-1.5 text-[10px] font-medium tracking-wide uppercase text-white bg-brand-turquoise rounded-full px-2.5 py-0.5">
                    {t.context}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewSystem;
