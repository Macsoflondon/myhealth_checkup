import React from 'react';
import { Star, Clock } from 'lucide-react';

const TrustSignals: React.FC = () => {
  return (
    <div className="bg-white py-4 border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
          {/* Feefo Reviews */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="font-bold text-black">feefo</span>
              <div className="flex text-yellow-400 ml-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
            <span>Over 13,000 5 star reviews.</span>
          </div>

          {/* Clearpay */}
          <div className="flex items-center gap-2">
            <div className="bg-teal-400 text-white px-2 py-1 rounded text-xs font-bold">
              clearpay
            </div>
            <span>Shop now. Pay later. Always interest free.</span>
          </div>

          {/* Fast Turnaround */}
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <span>Fast turnaround time.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;