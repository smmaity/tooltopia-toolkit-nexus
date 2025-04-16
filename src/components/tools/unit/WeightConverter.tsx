
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedElement from "@/components/animated-element";

type UnitType = {
  name: string;
  symbol: string;
  value: number; // Relative to kilograms
};

const weightUnits: UnitType[] = [
  { name: "Microgram", symbol: "μg", value: 1e-9 },
  { name: "Milligram", symbol: "mg", value: 1e-6 },
  { name: "Gram", symbol: "g", value: 0.001 },
  { name: "Kilogram", symbol: "kg", value: 1 },
  { name: "Metric Ton", symbol: "t", value: 1000 },
  { name: "Ounce", symbol: "oz", value: 0.0283495 },
  { name: "Pound", symbol: "lb", value: 0.453592 },
  { name: "Stone", symbol: "st", value: 6.35029 },
  { name: "US Ton", symbol: "ton", value: 907.185 },
  { name: "Imperial Ton", symbol: "long ton", value: 1016.05 },
];

const WeightConverter = () => {
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("Kilogram");
  const [toUnit, setToUnit] = useState<string>("Pound");
  const [result, setResult] = useState<string>("2.20462");

  useEffect(() => {
    calculateConversion();
  }, [inputValue, fromUnit, toUnit]);

  const calculateConversion = () => {
    const value = parseFloat(inputValue);
    
    if (isNaN(value)) {
      setResult("");
      return;
    }

    const fromUnitObj = weightUnits.find(unit => unit.name === fromUnit);
    const toUnitObj = weightUnits.find(unit => unit.name === toUnit);

    if (fromUnitObj && toUnitObj) {
      // Convert to base unit (kilograms), then to target unit
      const baseValue = value * fromUnitObj.value;
      const convertedValue = baseValue / toUnitObj.value;
      
      // Format the result
      setResult(convertedValue.toLocaleString(undefined, {
        maximumFractionDigits: 10,
        useGrouping: true
      }));
    }
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <AnimatedElement>
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <Label htmlFor="from-value">Value</Label>
            <Input
              id="from-value"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a value"
            />
          </div>

          <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
            <div className="space-y-2">
              <Label htmlFor="from-unit">From</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger id="from-unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {weightUnits.map((unit) => (
                    <SelectItem key={unit.name} value={unit.name}>
                      {unit.name} ({unit.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center h-12">
              <button
                onClick={handleSwapUnits}
                className="rounded-full p-2 hover:bg-muted"
                title="Swap units"
              >
                ⇄
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-unit">To</Label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger id="to-unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {weightUnits.map((unit) => (
                    <SelectItem key={unit.name} value={unit.name}>
                      {unit.name} ({unit.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Result</div>
              <div className="text-2xl font-semibold break-all">
                {result ? `${result} ${weightUnits.find(u => u.name === toUnit)?.symbol}` : "-"}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {inputValue && result
                  ? `${inputValue} ${weightUnits.find(u => u.name === fromUnit)?.symbol} = ${result} ${weightUnits.find(u => u.name === toUnit)?.symbol}`
                  : ""}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimatedElement>
  );
};

export default WeightConverter;
