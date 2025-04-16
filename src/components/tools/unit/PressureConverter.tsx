
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedElement from "@/components/animated-element";

type UnitType = {
  name: string;
  symbol: string;
  value: number; // Relative to pascals
};

const pressureUnits: UnitType[] = [
  { name: "Pascal", symbol: "Pa", value: 1 },
  { name: "Kilopascal", symbol: "kPa", value: 1000 },
  { name: "Megapascal", symbol: "MPa", value: 1000000 },
  { name: "Bar", symbol: "bar", value: 100000 },
  { name: "Millibar", symbol: "mbar", value: 100 },
  { name: "Atmosphere", symbol: "atm", value: 101325 },
  { name: "Torr", symbol: "Torr", value: 133.322 },
  { name: "Pound per square inch", symbol: "psi", value: 6894.76 },
  { name: "Inch of mercury", symbol: "inHg", value: 3386.39 },
];

const PressureConverter = () => {
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("Bar");
  const [toUnit, setToUnit] = useState<string>("Pound per square inch");
  const [result, setResult] = useState<string>("14.5038");

  useEffect(() => {
    calculateConversion();
  }, [inputValue, fromUnit, toUnit]);

  const calculateConversion = () => {
    const value = parseFloat(inputValue);
    
    if (isNaN(value)) {
      setResult("");
      return;
    }

    const fromUnitObj = pressureUnits.find(unit => unit.name === fromUnit);
    const toUnitObj = pressureUnits.find(unit => unit.name === toUnit);

    if (fromUnitObj && toUnitObj) {
      // Convert to base unit (pascals), then to target unit
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
                  {pressureUnits.map((unit) => (
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
                  {pressureUnits.map((unit) => (
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
                {result ? `${result} ${pressureUnits.find(u => u.name === toUnit)?.symbol}` : "-"}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {inputValue && result
                  ? `${inputValue} ${pressureUnits.find(u => u.name === fromUnit)?.symbol} = ${result} ${pressureUnits.find(u => u.name === toUnit)?.symbol}`
                  : ""}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimatedElement>
  );
};

export default PressureConverter;
