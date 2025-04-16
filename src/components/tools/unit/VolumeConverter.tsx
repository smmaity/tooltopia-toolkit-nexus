
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedElement from "@/components/animated-element";

type UnitType = {
  name: string;
  symbol: string;
  value: number; // Relative to cubic meters
};

const volumeUnits: UnitType[] = [
  { name: "Milliliter", symbol: "ml", value: 0.000001 },
  { name: "Cubic Centimeter", symbol: "cm³", value: 0.000001 },
  { name: "Liter", symbol: "l", value: 0.001 },
  { name: "Cubic Meter", symbol: "m³", value: 1 },
  { name: "US Teaspoon", symbol: "tsp", value: 0.00000492892 },
  { name: "US Tablespoon", symbol: "tbsp", value: 0.0000147868 },
  { name: "US Fluid Ounce", symbol: "fl oz", value: 0.0000295735 },
  { name: "US Cup", symbol: "cup", value: 0.000236588 },
  { name: "US Pint", symbol: "pt", value: 0.000473176 },
  { name: "US Quart", symbol: "qt", value: 0.000946353 },
  { name: "US Gallon", symbol: "gal", value: 0.00378541 },
  { name: "Imperial Fluid Ounce", symbol: "fl oz (UK)", value: 0.0000284131 },
  { name: "Imperial Pint", symbol: "pt (UK)", value: 0.000568261 },
  { name: "Imperial Gallon", symbol: "gal (UK)", value: 0.00454609 },
  { name: "Cubic Inch", symbol: "in³", value: 0.0000163871 },
  { name: "Cubic Foot", symbol: "ft³", value: 0.0283168 },
];

const VolumeConverter = () => {
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("Liter");
  const [toUnit, setToUnit] = useState<string>("US Gallon");
  const [result, setResult] = useState<string>("0.264172");

  useEffect(() => {
    calculateConversion();
  }, [inputValue, fromUnit, toUnit]);

  const calculateConversion = () => {
    const value = parseFloat(inputValue);
    
    if (isNaN(value)) {
      setResult("");
      return;
    }

    const fromUnitObj = volumeUnits.find(unit => unit.name === fromUnit);
    const toUnitObj = volumeUnits.find(unit => unit.name === toUnit);

    if (fromUnitObj && toUnitObj) {
      // Convert to base unit (cubic meters), then to target unit
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
                  {volumeUnits.map((unit) => (
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
                  {volumeUnits.map((unit) => (
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
                {result ? `${result} ${volumeUnits.find(u => u.name === toUnit)?.symbol}` : "-"}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {inputValue && result
                  ? `${inputValue} ${volumeUnits.find(u => u.name === fromUnit)?.symbol} = ${result} ${volumeUnits.find(u => u.name === toUnit)?.symbol}`
                  : ""}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimatedElement>
  );
};

export default VolumeConverter;
