import { Link } from "react-router-dom";
import { PROVIDER_DETAILS } from "@/constants/providers";

const goodbody = PROVIDER_DETAILS['goodbody-clinic'];

const GoodbodyFeatureSection = () => {
  return (
    <section className="py-6 sm:py-8 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-xs sm:max-w-sm mx-auto">
          <Link
            to={`/provider/${goodbody.id}`}
            className="group bg-background rounded-xl p-6 sm:p-8 flex items-center justify-center
                       w-full h-36 sm:h-44
                       border border-border/50
                       transition-all duration-300 ease-out
                       hover:shadow-lg hover:shadow-primary/10
                       hover:-translate-y-1 hover:scale-105
                       hover:border-primary/30"
          >
            <img
              src={goodbody.logo}
              alt={`${goodbody.name} logo`}
              className="w-auto max-h-[130px] sm:max-h-[160px] object-contain transition-all duration-300 group-hover:scale-110"
              loading="lazy"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GoodbodyFeatureSection;
