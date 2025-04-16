
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AnimatedElement from "@/components/animated-element";

type TempUnit = {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
};

const temperatureUnits: TempUnit[] = [
  {
    name: "Celsius",
    symbol: "°C",
    toBase: (value) => value, // Celsius is our base unit
    fromBase: (value) => value,
  },
  {
    name: "Fahrenheit",
    symbol: "°F",
    toBase: (value) => (value - 32) * (5 / 9),
    fromBase: (value) => value * (9 / 5) + 32,
  },
  {
    name: "Kelvin",
    symbol: "K",
    toBase: (value) => value - 273.15,
    fromBase: (value) => value + 273.15,
  },
];

const TemperatureConverter = () => {
  const [inputValue, setInputValue] = useState<string>("0");
  const [fromUnit, setFromUnit] = useState<string>("Celsius");
  const [toUnit, setToUnit] = useState<string>("Fahrenheit");
  const [result, setResult] = useState<string>("32");

  useEffect(() => {
    calculateConversion();
  }, [inputValue, fromUnit, toUnit]);

  const calculateConversion = () => {
    const value = parseFloat(inputValue);
    
    if (isNaN(value)) {
      setResult("");
      return;
    }

    const fromUnitObj = temperatureUnits.find(unit => unit.name === fromUnit);
    const toUnitObj = temperatureUnits.find(unit => unit.name === toUnit);

    if (fromUnitObj && toUnitObj) {
      // Convert to base unit (Celsius), then to target unit
      const baseValue = fromUnitObj.toBase(value);
      const convertedValue = toUnitObj.fromBase(baseValue);
      
      // Format the result
      setResult(convertedValue.toLocaleString(undefined, {
        maximumFractionDigits: 4,
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
                  {temperatureUnits.map((unit) => (
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
                  {temperatureUnits.map((unit) => (
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
                {result ? `${result} ${temperatureUnits.find(u => u.name === toUnit)?.symbol}` : "-"}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {inputValue && result
                  ? `${inputValue} ${temperatureUnits.find(u => u.name === fromUnit)?.symbol} = ${result} ${temperatureUnits.find(u => u.name === toUnit)?.symbol}`
                  : ""}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimatedElement>
  );
};

export default TemperatureConverter;
