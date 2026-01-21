import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Search, Loader2, FlaskConical } from "lucide-react";
import { useBiomarkersLibrary, BiomarkerDefinition } from "@/hooks/useBiomarkersLibrary";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface BiomarkerEntry {
  biomarkerName: string;
  value: number | string;
  unit: string;
}

interface BiomarkerInputFormProps {
  onSubmit: (readings: BiomarkerEntry[], gender?: "male" | "female", age?: number) => void;
  isLoading: boolean;
}

const COMMON_PANELS = [
  {
    name: "Full Blood Count",
    biomarkers: ["Haemoglobin", "Red Blood Cells", "White Blood Cells", "Platelets", "Haematocrit"]
  },
  {
    name: "Lipid Profile",
    biomarkers: ["Total Cholesterol", "HDL Cholesterol", "LDL Cholesterol", "Triglycerides"]
  },
  {
    name: "Thyroid Panel",
    biomarkers: ["TSH", "Free T4", "Free T3"]
  },
  {
    name: "Liver Function",
    biomarkers: ["ALT", "AST", "ALP", "GGT", "Bilirubin", "Albumin"]
  },
  {
    name: "Kidney Function",
    biomarkers: ["Creatinine", "Urea", "eGFR"]
  },
  {
    name: "Diabetes Markers",
    biomarkers: ["HbA1c", "Fasting Glucose"]
  }
];

export function BiomarkerInputForm({ onSubmit, isLoading }: BiomarkerInputFormProps) {
  const [entries, setEntries] = useState<BiomarkerEntry[]>([
    { biomarkerName: "", value: "", unit: "" }
  ]);
  const [gender, setGender] = useState<"male" | "female" | undefined>();
  const [age, setAge] = useState<number | undefined>();
  const [openBiomarkerIndex, setOpenBiomarkerIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { biomarkers, searchBiomarkers, getBiomarkerInfo } = useBiomarkersLibrary();

  const addEntry = () => {
    setEntries([...entries, { biomarkerName: "", value: "", unit: "" }]);
  };

  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };

  const updateEntry = (index: number, field: keyof BiomarkerEntry, value: string | number) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    
    // Auto-fill unit when biomarker is selected
    if (field === "biomarkerName" && typeof value === "string") {
      const biomarkerInfo = getBiomarkerInfo(value);
      if (biomarkerInfo?.unit_of_measurement) {
        newEntries[index].unit = biomarkerInfo.unit_of_measurement;
      }
    }
    
    setEntries(newEntries);
  };

  const selectBiomarker = (index: number, biomarker: BiomarkerDefinition) => {
    updateEntry(index, "biomarkerName", biomarker.biomarker_name);
    if (biomarker.unit_of_measurement) {
      updateEntry(index, "unit", biomarker.unit_of_measurement);
    }
    setOpenBiomarkerIndex(null);
    setSearchQuery("");
  };

  const addPanel = (panelBiomarkers: string[]) => {
    const newEntries = panelBiomarkers.map(name => {
      const info = getBiomarkerInfo(name);
      return {
        biomarkerName: name,
        value: "",
        unit: info?.unit_of_measurement || ""
      };
    });
    
    // Filter out empty entries and add panel biomarkers
    const nonEmptyEntries = entries.filter(e => e.biomarkerName.trim());
    setEntries([...nonEmptyEntries, ...newEntries]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validEntries = entries.filter(
      e => e.biomarkerName.trim() && e.value !== "" && !isNaN(Number(e.value))
    ).map(e => ({
      biomarkerName: e.biomarkerName,
      value: Number(e.value),
      unit: e.unit
    }));

    if (validEntries.length === 0) return;
    
    onSubmit(validEntries, gender, age);
  };

  const isValid = entries.some(
    e => e.biomarkerName.trim() && e.value !== "" && !isNaN(Number(e.value))
  );

  const searchResults = searchBiomarkers(searchQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          Enter Your Biomarker Readings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quick Add Panels */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Add Common Panels</Label>
            <div className="flex flex-wrap gap-2">
              {COMMON_PANELS.map(panel => (
                <Badge
                  key={panel.name}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => addPanel(panel.biomarkers)}
                >
                  + {panel.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender (for reference ranges)</Label>
              <Select value={gender} onValueChange={(v) => setGender(v as "male" | "female")}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age (optional)</Label>
              <Input
                id="age"
                type="number"
                min={1}
                max={120}
                value={age || ""}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Your age"
              />
            </div>
          </div>

          {/* Biomarker Entries */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Biomarker Readings</Label>
            
            {entries.map((entry, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <Popover 
                    open={openBiomarkerIndex === index} 
                    onOpenChange={(open) => setOpenBiomarkerIndex(open ? index : null)}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {entry.biomarkerName || "Select biomarker..."}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <Command>
                        <CommandInput 
                          placeholder="Search biomarkers..." 
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandList>
                          <CommandEmpty>No biomarker found.</CommandEmpty>
                          <CommandGroup>
                            {searchResults.map(bio => (
                              <CommandItem
                                key={bio.id}
                                value={bio.biomarker_name}
                                onSelect={() => selectBiomarker(index, bio)}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{bio.biomarker_name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {bio.category} • {bio.unit_of_measurement || "Various units"}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="w-24">
                  <Input
                    type="number"
                    step="any"
                    value={entry.value}
                    onChange={(e) => updateEntry(index, "value", e.target.value)}
                    placeholder="Value"
                  />
                </div>

                <div className="w-20">
                  <Input
                    type="text"
                    value={entry.unit}
                    onChange={(e) => updateEntry(index, "unit", e.target.value)}
                    placeholder="Unit"
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEntry(index)}
                  disabled={entries.length === 1}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEntry}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Biomarker
            </Button>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analysing Your Results...
              </>
            ) : (
              "Analyse My Results"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
