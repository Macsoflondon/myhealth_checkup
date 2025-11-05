
import React from "react";
import { TableHead } from "@/components/ui/table";

interface ProviderHeaderProps {
  item: {
    id: string;
    name: string;
    provider: string;
    providerLogo: string;
    price: number;
    available?: boolean;
  };
}

const ProviderHeader = ({ item }: ProviderHeaderProps) => {
  const isSvg = item.providerLogo.endsWith('.svg');
  const webpLogo = isSvg ? item.providerLogo : item.providerLogo.replace(/\.(png|jpg|jpeg)$/, '.webp');
  
  return (
    <TableHead key={item.id} className="min-w-[200px]">
      <div className="flex flex-col items-center gap-1">
        {isSvg ? (
          <img 
            src={item.providerLogo} 
            alt={item.provider} 
            className="h-10 w-auto object-contain mb-2"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <picture>
            <source srcSet={webpLogo} type="image/webp" />
            <img 
              src={item.providerLogo} 
              alt={item.provider} 
              className="h-10 w-auto object-contain mb-2"
              loading="lazy"
              decoding="async"
            />
          </picture>
        )}
        <span className="font-semibold">{item.name}</span>
        <span className="text-health-600 font-bold">£{item.price.toFixed(2)}</span>
        {item.available === false && (
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
            Out of stock
          </span>
        )}
      </div>
    </TableHead>
  );
};

export default ProviderHeader;
