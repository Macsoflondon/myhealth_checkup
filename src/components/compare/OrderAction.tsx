
import React from "react";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderActionProps {
  item: {
    id: string;
    provider: string;
    available?: boolean;
  };
  onPlaceOrder: (id: string, provider: string) => void;
}

const OrderAction = ({ item, onPlaceOrder }: OrderActionProps) => {
  const isMobile = useIsMobile();
  
  return (
    <TableCell key={`${item.id}-order`} className="text-center">
      <Button 
        size="sm" 
        className="w-full"
        disabled={item.available === false}
        onClick={() => onPlaceOrder(item.id, item.provider)}
      >
        {isMobile ? "Order" : "Order Now"}
      </Button>
    </TableCell>
  );
};

export default OrderAction;
