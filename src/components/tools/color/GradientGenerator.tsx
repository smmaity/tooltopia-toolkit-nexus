
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Copy, Rotate3D } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import AnimatedElement from "@/components/animated-element";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type GradientType = "linear" | "radial" | "conic";
type GradientDirection = 
  | "to right" 
  | "to bottom" 
  | "to bottom right" 
  | "to bottom left"
  | "to top"
  | "to top right"
  | "to top left"
  | "to left";

interface ColorStop {
  color: string;
  position: number;
}

const GradientGenerator = () => {
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [direction, setDirection] = useState<GradientDirection>("to right");
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: "#3b82f6", position: 0 },
    { color: "#8b5cf6", position: 100 }
  ]);
  const [cssCode, setCssCode] = useState("");
  const [recentGradients, setRecentGradients] = useState<string[]>([]);

  useEffect(() => {
    updateGradientCode();
  }, [gradientType, direction, colorStops]);

  const updateGradientCode = () => {
    let code = "";
    
    if (gradientType === "linear") {
      code = `linear-gradient(${direction}, ${colorStops
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(", ")})`;
    } else if (gradientType === "radial") {
      code = `radial-gradient(circle, ${colorStops
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(", ")})`;
    } else if (gradientType === "conic") {
      code = `conic-gradient(${colorStops
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(", ")})`;
    }
    
    setCssCode(code);
    
    // Save to recent gradients if it's not already there
    if (!recentGradients.includes(code) && recentGradients.length < 8) {
      setRecentGradients(prev => [code, ...prev]);
    } else if (!recentGradients.includes(code)) {
      setRecentGradients(prev => [code, ...prev.slice(0, 7)]);
    }
  };

  const handleColorChange = (index: number, newColor: string) => {
    const newStops = [...colorStops];
    newStops[index].color = newColor;
    setColorStops(newStops);
  };

  const handlePositionChange = (index: number, newPosition: number) => {
    const newStops = [...colorStops];
    newStops[index].position = newPosition;
    setColorStops(newStops);
  };

  const addColorStop = () => {
    if (colorStops.length >= 5) {
      toast.warning("Maximum 5 color stops allowed");
      return;
    }
    
    // Calculate a reasonable position for the new stop
    const positions = colorStops.map(stop => stop.position);
    const maxPosition = Math.max(...positions);
    const minPosition = Math.min(...positions);
    let newPosition = 50;
    
    if (maxPosition < 100) {
      newPosition = Math.min(100, maxPosition + 25);
    } else if (minPosition > 0) {
      newPosition = Math.max(0, minPosition - 25);
    }
    
    setColorStops([...colorStops, { color: "#a855f7", position: newPosition }]);
  };

  const removeColorStop = (index: number) => {
    if (colorStops.length <= 2) {
      toast.warning("Minimum 2 color stops required");
      return;
    }
    
    const newStops = [...colorStops];
    newStops.splice(index, 1);
    setColorStops(newStops);
  };

  const reverseGradient = () => {
    setColorStops([...colorStops].reverse().map(stop => ({
      ...stop,
      position: 100 - stop.position
    })));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`background: ${cssCode};`);
    toast.success("CSS copied to clipboard");
  };

  const selectGradient = (gradient: string) => {
    setCssCode(gradient);
    
    // Move the selected gradient to the top of the list
    setRecentGradients([
      gradient,
      ...recentGradients.filter(g => g !== gradient)
    ]);
  };

  return (
    <AnimatedElement>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Gradient Type</Label>
                <Select value={gradientType} onValueChange={(value: GradientType) => setGradientType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gradient type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear Gradient</SelectItem>
                    <SelectItem value="radial">Radial Gradient</SelectItem>
                    <SelectItem value="conic">Conic Gradient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {gradientType === "linear" && (
                <div className="space-y-2">
                  <Label>Direction</Label>
                  <Select 
                    value={direction} 
                    onValueChange={(value: GradientDirection) => setDirection(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to right">Left to Right</SelectItem>
                      <SelectItem value="to bottom">Top to Bottom</SelectItem>
                      <SelectItem value="to bottom right">Top Left to Bottom Right</SelectItem>
                      <SelectItem value="to bottom left">Top Right to Bottom Left</SelectItem>
                      <SelectItem value="to top">Bottom to Top</SelectItem>
                      <SelectItem value="to left">Right to Left</SelectItem>
                      <SelectItem value="to top right">Bottom Left to Top Right</SelectItem>
                      <SelectItem value="to top left">Bottom Right to Top Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Color Stops</Label>
                  <Button variant="outline" size="sm" onClick={addColorStop}>
                    Add Color
                  </Button>
                </div>
                
                {colorStops.map((stop, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={stop.color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <div className="flex-1">
                      <Label className="text-xs">{stop.position}%</Label>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[stop.position]}
                        onValueChange={(values) => handlePositionChange(index, values[0])}
                      />
                    </div>
                    {colorStops.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeColorStop(index)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <Label>CSS Code</Label>
                <div className="relative">
                  <Input
                    value={`background: ${cssCode};`}
                    readOnly
                    className="pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={copyToClipboard}
                  >
                    <Copy size={16} />
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={reverseGradient}>
                <Rotate3D size={16} className="mr-2" />
                Reverse Gradient
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <Label className="mb-4 block">Preview</Label>
              <div
                className="w-full h-64 rounded-lg border shadow-sm"
                style={{ background: cssCode }}
              ></div>
            </CardContent>
          </Card>

          {recentGradients.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <Label className="mb-3 block">Recent Gradients</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {recentGradients.map((gradient, index) => (
                    <div
                      key={index}
                      className="w-full aspect-square rounded-md cursor-pointer border"
                      style={{ background: gradient }}
                      onClick={() => selectGradient(gradient)}
                    ></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AnimatedElement>
  );
};

export default GradientGenerator;
