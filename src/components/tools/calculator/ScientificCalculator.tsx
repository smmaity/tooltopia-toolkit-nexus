
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import AnimatedElement from "@/components/animated-element";

const ScientificCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [resetDisplay, setResetDisplay] = useState(false);
  const [memory, setMemory] = useState<number | null>(null);
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("deg");

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
      case '^': return Math.pow(a, b);
      case 'mod': return a % b;
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

  const handleScientificOperation = (op: string) => {
    const current = parseFloat(display);
    let result: number;
    
    switch (op) {
      case 'sin':
        result = angleMode === "deg" ? 
          Math.sin(current * Math.PI / 180) : 
          Math.sin(current);
        break;
      case 'cos':
        result = angleMode === "deg" ? 
          Math.cos(current * Math.PI / 180) : 
          Math.cos(current);
        break;
      case 'tan':
        result = angleMode === "deg" ? 
          Math.tan(current * Math.PI / 180) : 
          Math.tan(current);
        break;
      case 'log':
        result = Math.log10(current);
        break;
      case 'ln':
        result = Math.log(current);
        break;
      case 'sqrt':
        result = Math.sqrt(current);
        break;
      case 'square':
        result = Math.pow(current, 2);
        break;
      case '1/x':
        result = 1 / current;
        break;
      case 'exp':
        result = Math.exp(current);
        break;
      case 'pi':
        result = Math.PI;
        setResetDisplay(true);
        break;
      case 'e':
        result = Math.E;
        setResetDisplay(true);
        break;
      default:
        result = current;
    }
    
    if (isNaN(result) || !isFinite(result)) {
      toast.error("Invalid operation");
      return;
    }
    
    setDisplay(result.toString());
  };

  const handleMemoryOperation = (op: string) => {
    const current = parseFloat(display);
    
    switch (op) {
      case 'ms':
        setMemory(current);
        toast.success("Value stored in memory");
        break;
      case 'mr':
        if (memory !== null) {
          setDisplay(memory.toString());
          setResetDisplay(false);
        }
        break;
      case 'mc':
        setMemory(null);
        toast.success("Memory cleared");
        break;
      case 'm+':
        if (memory !== null) {
          setMemory(memory + current);
          toast.success("Value added to memory");
        } else {
          setMemory(current);
          toast.success("Value stored in memory");
        }
        break;
      case 'm-':
        if (memory !== null) {
          setMemory(memory - current);
          toast.success("Value subtracted from memory");
        } else {
          setMemory(-current);
          toast.success("Negative value stored in memory");
        }
        break;
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
            
            <div className="flex justify-between items-center my-2 text-sm">
              <div className="flex gap-2">
                <Button
                  variant={angleMode === "deg" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAngleMode("deg")}
                >
                  DEG
                </Button>
                <Button
                  variant={angleMode === "rad" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAngleMode("rad")}
                >
                  RAD
                </Button>
              </div>
              {memory !== null && (
                <span className="text-muted-foreground">M = {memory}</span>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="basic">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="scientific">Scientific</TabsTrigger>
              <TabsTrigger value="memory">Memory</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="mt-0">
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
                <Button variant="default" onClick={handleEquals}>
                  =
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="scientific" className="mt-0">
              <div className="grid grid-cols-4 gap-2">
                <Button variant="secondary" onClick={() => handleScientificOperation('sin')}>
                  sin
                </Button>
                <Button variant="secondary" onClick={() => handleScientificOperation('cos')}>
                  cos
                </Button>
                <Button variant="secondary" onClick={() => handleScientificOperation('tan')}>
                  tan
                </Button>
                <Button variant="secondary" onClick={() => handleOperationClick('^')}>
                  x^y
                </Button>
                
                <Button variant="secondary" onClick={() => handleScientificOperation('log')}>
                  log
                </Button>
                <Button variant="secondary" onClick={() => handleScientificOperation('ln')}>
                  ln
                </Button>
                <Button variant="secondary" onClick={() => handleScientificOperation('sqrt')}>
                  √
                </Button>
                <Button variant="secondary" onClick={() => handleScientificOperation('square')}>
                  x²
                </Button>
                
                <Button variant="secondary" onClick={() => handleScientificOperation('1/x')}>
                  1/x
                </Button>
                <Button variant="secondary" onClick={() => handleScientificOperation('exp')}>
                  e^x
                </Button>
                <Button variant="secondary" onClick={() => handleScientificOperation('pi')}>
                  π
                </Button>
                <Button variant="secondary" onClick={() => handleScientificOperation('e')}>
                  e
                </Button>
                
                <Button variant="secondary" onClick={() => handleOperationClick('mod')}>
                  mod
                </Button>
                <Button variant="secondary" onClick={handleClear}>
                  C
                </Button>
                <Button variant="outline" onClick={handleBackspace}>
                  ←
                </Button>
                <Button variant="default" onClick={handleEquals}>
                  =
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="memory" className="mt-0">
              <div className="grid grid-cols-3 gap-2">
                <Button variant="secondary" onClick={() => handleMemoryOperation('ms')}>
                  MS
                </Button>
                <Button variant="secondary" onClick={() => handleMemoryOperation('mr')}>
                  MR
                </Button>
                <Button variant="secondary" onClick={() => handleMemoryOperation('mc')}>
                  MC
                </Button>
                
                <Button variant="secondary" onClick={() => handleMemoryOperation('m+')}>
                  M+
                </Button>
                <Button variant="secondary" onClick={() => handleMemoryOperation('m-')}>
                  M-
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  C
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AnimatedElement>
  );
};

export default ScientificCalculator;
