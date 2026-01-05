import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CMATransparencyBanner = () => {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary py-3 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Transparency Statement
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                myhealth checkup operates in full compliance with the Competition and Markets Authority 
                (CMA) and the Digital Markets, Competition and Consumers Act 2024. Prices include all 
                mandatory fees where known, sponsored listings are clearly marked, and data is refreshed 
                daily for accuracy.
              </p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="whitespace-nowrap self-start sm:self-center"
          >
            <Link to="/how-we-rank" className="flex items-center gap-1">
              Learn how we rank
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CMATransparencyBanner;
