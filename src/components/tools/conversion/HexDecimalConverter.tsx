
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import AnimatedElement from "@/components/animated-element";

const HexDecimalConverter = () => {
  const [hex, setHex] = useState("");
  const [decimal, setDecimal] = useState("");

  // Validate hex input
  const validateHex = (value: string): boolean => {
    return /^[0-9A-Fa-f]*$/.test(value);
  };

  // Validate decimal input
  const validateDecimal = (value: string): boolean => {
    return /^\d*$/.test(value);
  };

  // Hex to Decimal conversion
  const convertHexToDecimal = () => {
    if (!hex) {
      toast.error("Please enter a hexadecimal value");
      return;
    }

    if (!validateHex(hex)) {
      toast.error("Invalid hexadecimal input. Only 0-9 and A-F are allowed.");
      return;
    }

    try {
      const result = parseInt(hex, 16);
      setDecimal(result.toString());
      toast.success("Conversion successful");
    } catch (error) {
      toast.error("Conversion failed");
    }
  };

  // Decimal to Hex conversion
  const convertDecimalToHex = () => {
    if (!decimal) {
      toast.error("Please enter a decimal value");
      return;
    }

    if (!validateDecimal(decimal)) {
      toast.error("Invalid decimal input. Only digits are allowed.");
      return;
    }

    try {
      const decimalValue = parseInt(decimal, 10);
      if (decimalValue < 0) {
        toast.error("Please enter a positive number");
        return;
      }
      const result = decimalValue.toString(16).toUpperCase();
      setHex(result);
      toast.success("Conversion successful");
    } catch (error) {
      toast.error("Conversion failed");
    }
  };

  const resetFields = () => {
    setHex("");
    setDecimal("");
  };

  return (
    <AnimatedElement>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Hex ⇄ Decimal Converter</CardTitle>
          <CardDescription>
            Convert between hexadecimal and decimal number systems
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="hex-input">Hexadecimal</Label>
              <Input
                id="hex-input"
                placeholder="Enter hex (e.g. 1A or FF)"
                value={hex}
                onChange={(e) => setHex(e.target.value.toUpperCase())}
              />
              <p className="text-xs text-muted-foreground">
                Valid characters: 0-9, A-F
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="space-x-2">
                <Button onClick={convertHexToDecimal}>
                  Hex to Decimal ↓
                </Button>
                <Button onClick={convertDecimalToHex}>
                  ↑ Decimal to Hex
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="decimal-input">Decimal</Label>
              <Input
                id="decimal-input"
                placeholder="Enter decimal (e.g. 42 or 255)"
                value={decimal}
                onChange={(e) => setDecimal(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Valid characters: 0-9
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Common Hex Values</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setHex("FF");
                  setDecimal("255");
                }}
              >
                FF = 255
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setHex("A");
                  setDecimal("10");
                }}
              >
                A = 10
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setHex("64");
                  setDecimal("100");
                }}
              >
                64 = 100
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setHex("FF00FF");
                  setDecimal("16711935");
                }}
              >
                FF00FF
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={resetFields}>
              Reset Fields
            </Button>
          </div>
        </CardContent>
      </Card>
    </AnimatedElement>
  );
};

export default HexDecimalConverter;
