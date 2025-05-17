
import React from "react";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";

interface OrderActionProps {
  item: {
    id: string;
    provider: string;
    available?: boolean;
  };
  onPlaceOrder: (id: string, provider: string) => void;
}

const OrderAction = ({ item, onPlaceOrder }: OrderActionProps) => {
  return (
    <TableCell key={`${item.id}-order`} className="text-center">
      <Button 
        size="sm" 
        className="w-full"
        disabled={item.available === false}
        onClick={() => onPlaceOrder(item.id, item.provider)}
      >
        Order Now
      </Button>
    </TableCell>
  );
};

export default OrderAction;
