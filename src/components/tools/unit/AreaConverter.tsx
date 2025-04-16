
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedElement from "@/components/animated-element";

type UnitType = {
  name: string;
  symbol: string;
  value: number; // Relative to square meters
};

const areaUnits: UnitType[] = [
  { name: "Square Millimeter", symbol: "mm²", value: 0.000001 },
  { name: "Square Centimeter", symbol: "cm²", value: 0.0001 },
  { name: "Square Meter", symbol: "m²", value: 1 },
  { name: "Square Kilometer", symbol: "km²", value: 1000000 },
  { name: "Square Inch", symbol: "in²", value: 0.00064516 },
  { name: "Square Foot", symbol: "ft²", value: 0.092903 },
  { name: "Square Yard", symbol: "yd²", value: 0.836127 },
  { name: "Square Mile", symbol: "mi²", value: 2589988.11 },
  { name: "Acre", symbol: "ac", value: 4046.86 },
  { name: "Hectare", symbol: "ha", value: 10000 },
];

const AreaConverter = () => {
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("Square Meter");
  const [toUnit, setToUnit] = useState<string>("Square Foot");
  const [result, setResult] = useState<string>("10.7639");

  useEffect(() => {
    calculateConversion();
  }, [inputValue, fromUnit, toUnit]);

  const calculateConversion = () => {
    const value = parseFloat(inputValue);
    
    if (isNaN(value)) {
      setResult("");
      return;
    }

    const fromUnitObj = areaUnits.find(unit => unit.name === fromUnit);
    const toUnitObj = areaUnits.find(unit => unit.name === toUnit);

    if (fromUnitObj && toUnitObj) {
      // Convert to base unit (square meters), then to target unit
      const baseValue = value * fromUnitObj.value;
      const convertedValue = baseValue / toUnitObj.value;
      
      // Format the result
      setResult(convertedValue.toLocaleString(undefined, {
        maximumFractionDigits: 6,
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
                  {areaUnits.map((unit) => (
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
                  {areaUnits.map((unit) => (
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
                {result ? `${result} ${areaUnits.find(u => u.name === toUnit)?.symbol}` : "-"}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {inputValue && result
                  ? `${inputValue} ${areaUnits.find(u => u.name === fromUnit)?.symbol} = ${result} ${areaUnits.find(u => u.name === toUnit)?.symbol}`
                  : ""}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimatedElement>
  );
};

export default AreaConverter;
