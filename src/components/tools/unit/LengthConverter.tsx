
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedElement from "@/components/animated-element";

type UnitType = {
  name: string;
  value: number; // Relative to meters
};

const lengthUnits: UnitType[] = [
  { name: "Millimeter (mm)", value: 0.001 },
  { name: "Centimeter (cm)", value: 0.01 },
  { name: "Decimeter (dm)", value: 0.1 },
  { name: "Meter (m)", value: 1 },
  { name: "Kilometer (km)", value: 1000 },
  { name: "Inch (in)", value: 0.0254 },
  { name: "Foot (ft)", value: 0.3048 },
  { name: "Yard (yd)", value: 0.9144 },
  { name: "Mile (mi)", value: 1609.344 },
  { name: "Nautical Mile (nmi)", value: 1852 },
];

const LengthConverter = () => {
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("Meter (m)");
  const [toUnit, setToUnit] = useState<string>("Centimeter (cm)");
  const [result, setResult] = useState<string>("100");

  useEffect(() => {
    calculateConversion();
  }, [inputValue, fromUnit, toUnit]);

  const calculateConversion = () => {
    const value = parseFloat(inputValue);
    
    if (isNaN(value)) {
      setResult("");
      return;
    }

    const fromUnitObj = lengthUnits.find(unit => unit.name === fromUnit);
    const toUnitObj = lengthUnits.find(unit => unit.name === toUnit);

    if (fromUnitObj && toUnitObj) {
      // Convert to base unit (meters), then to target unit
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
                  {lengthUnits.map((unit) => (
                    <SelectItem key={unit.name} value={unit.name}>
                      {unit.name}
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
                  {lengthUnits.map((unit) => (
                    <SelectItem key={unit.name} value={unit.name}>
                      {unit.name}
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
                {result ? `${result} ${toUnit.split(" ")[1].replace(/[()]/g, "")}` : "-"}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {inputValue && result
                  ? `${inputValue} ${fromUnit.split(" ")[1].replace(/[()]/g, "")} = ${result} ${toUnit.split(" ")[1].replace(/[()]/g, "")}`
                  : ""}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimatedElement>
  );
};

export default LengthConverter;
