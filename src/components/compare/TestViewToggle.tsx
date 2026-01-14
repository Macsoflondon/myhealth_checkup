import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, Layers, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type TestViewMode = "list" | "grouped" | "table";

interface TestViewToggleProps {
  value: TestViewMode;
  onChange: (value: TestViewMode) => void;
  className?: string;
}

export const TestViewToggle: React.FC<TestViewToggleProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <ToggleGroup 
      type="single" 
      value={value} 
      onValueChange={(v) => v && onChange(v as TestViewMode)}
      className={cn("bg-muted/50 p-1 rounded-lg", className)}
    >
      <ToggleGroupItem 
        value="list" 
        aria-label="List view"
        className="data-[state=on]:bg-background data-[state=on]:shadow-sm gap-1.5 px-3"
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline text-sm">List</span>
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="grouped" 
        aria-label="Grouped view"
        className="data-[state=on]:bg-background data-[state=on]:shadow-sm gap-1.5 px-3"
      >
        <Layers className="h-4 w-4" />
        <span className="hidden sm:inline text-sm">Grouped</span>
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="table" 
        aria-label="Table view"
        className="data-[state=on]:bg-background data-[state=on]:shadow-sm gap-1.5 px-3"
      >
        <Table2 className="h-4 w-4" />
        <span className="hidden sm:inline text-sm">Table</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default TestViewToggle;
