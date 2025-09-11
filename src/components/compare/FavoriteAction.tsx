
import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TableCell } from "@/components/ui/table";

interface FavoriteActionProps {
  item: {
    id: string;
  };
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const FavoriteAction = ({ item, isFavorite, onToggleFavorite }: FavoriteActionProps) => {
  return (
    <TableCell key={`${item.id}-favorite`} className="text-center">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onToggleFavorite(item.id)}
        className={cn(
          "hover:bg-pink-50",
          isFavorite ? "text-pink-500" : "text-gray-400"
        )}
      >
        <Heart className="h-5 w-5 text-[#22c0d4]" fill={isFavorite ? "currentColor" : "none"} />
      </Button>
    </TableCell>
  );
};

export default FavoriteAction;
