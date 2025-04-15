
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import AnimatedElement from "@/components/animated-element";

const BasicCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [resetDisplay, setResetDisplay] = useState(false);

  const handleNumberClick = (number: string) => {
    if (display === "0" || resetDisplay) {
      setDisplay(number);
      setResetDisplay(false);
    } else {
      setDisplay(display + number);
    }
  };

  const handleOperationClick = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (operation) {
      const result = calculate(previousValue, current, operation);
      setPreviousValue(result);
      setDisplay(result.toString());
      toast.success(`${previousValue} ${operation} ${current} = ${result}`);
    }
    
    setOperation(op);
    setResetDisplay(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : NaN;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (previousValue !== null && operation) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, operation);
      
      if (isNaN(result) || !isFinite(result)) {
        toast.error("Invalid operation");
        handleClear();
        return;
      }
      
      setDisplay(result.toString());
      setPreviousValue(null);
      setOperation(null);
      toast.success(`${previousValue} ${operation} ${current} = ${result}`);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setResetDisplay(false);
  };

  const handleDecimal = () => {
    if (resetDisplay) {
      setDisplay("0.");
      setResetDisplay(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleBackspace = () => {
    if (display.length === 1 || display === "0") {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  return (
    <AnimatedElement>
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="mb-4">
            <Input
              value={display}
              readOnly
              className="text-right text-xl font-medium h-14"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" onClick={handleClear} className="col-span-2">
              Clear
            </Button>
            <Button variant="outline" onClick={handleBackspace}>
              ←
            </Button>
            <Button variant="secondary" onClick={() => handleOperationClick('÷')}>
              ÷
            </Button>
            
            {[7, 8, 9].map((num) => (
              <Button
                key={num}
                variant="outline"
                onClick={() => handleNumberClick(num.toString())}
              >
                {num}
              </Button>
            ))}
            <Button variant="secondary" onClick={() => handleOperationClick('×')}>
              ×
            </Button>
            
            {[4, 5, 6].map((num) => (
              <Button
                key={num}
                variant="outline"
                onClick={() => handleNumberClick(num.toString())}
              >
                {num}
              </Button>
            ))}
            <Button variant="secondary" onClick={() => handleOperationClick('-')}>
              -
            </Button>
            
            {[1, 2, 3].map((num) => (
              <Button
                key={num}
                variant="outline"
                onClick={() => handleNumberClick(num.toString())}
              >
                {num}
              </Button>
            ))}
            <Button variant="secondary" onClick={() => handleOperationClick('+')}>
              +
            </Button>
            
            <Button
              variant="outline"
              className="col-span-2"
              onClick={() => handleNumberClick('0')}
            >
              0
            </Button>
            <Button variant="outline" onClick={handleDecimal}>
              .
            </Button>
            <Button variant="primary" onClick={handleEquals}>
              =
            </Button>
          </div>
        </CardContent>
      </Card>
    </AnimatedElement>
  );
};

export default BasicCalculator;
