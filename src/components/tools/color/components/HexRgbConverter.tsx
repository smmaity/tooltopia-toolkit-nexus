
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import AnimatedElement from "@/components/animated-element";
import { hexToRgb, rgbToHex } from "../utils/colorConversion";

const HexRgbConverter = () => {
  const [hexColor, setHexColor] = useState("#3b82f6");
  const [rgbColor, setRgbColor] = useState({ r: 59, g: 130, b: 246 });

  const validateHex = (hex: string) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexColor(value);
    
    if (validateHex(value)) {
      const rgb = hexToRgb(value);
      if (rgb) {
        setRgbColor(rgb);
      }
    }
  };

  const handleRgbChange = (component: "r" | "g" | "b", value: string) => {
    const numValue = parseInt(value);
    
    if (isNaN(numValue)) return;
    
    const newRgb = {
      ...rgbColor,
      [component]: Math.max(0, Math.min(255, numValue))
    };
    
    setRgbColor(newRgb);
    setHexColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  return (
    <AnimatedElement>
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hex-input">HEX Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={hexColor}
                      onChange={handleHexChange}
                      className="w-12 h-10 p-1"
                    />
                    <div className="relative flex-1">
                      <Input
                        id="hex-input"
                        value={hexColor}
                        onChange={handleHexChange}
                        placeholder="#000000"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        onClick={() => copyToClipboard(hexColor, "HEX color")}
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>RGB Color</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="r-input" className="text-xs text-muted-foreground">
                        R
                      </Label>
                      <Input
                        id="r-input"
                        type="number"
                        min="0"
                        max="255"
                        value={rgbColor.r}
                        onChange={(e) => handleRgbChange("r", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="g-input" className="text-xs text-muted-foreground">
                        G
                      </Label>
                      <Input
                        id="g-input"
                        type="number"
                        min="0"
                        max="255"
                        value={rgbColor.g}
                        onChange={(e) => handleRgbChange("g", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="b-input" className="text-xs text-muted-foreground">
                        B
                      </Label>
                      <Input
                        id="b-input"
                        type="number"
                        min="0"
                        max="255"
                        value={rgbColor.b}
                        onChange={(e) => handleRgbChange("b", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="relative mt-2">
                    <Input
                      value={`rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`}
                      readOnly
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                      onClick={() => copyToClipboard(`rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`, "RGB color")}
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col">
              <Label className="mb-2">Preview</Label>
              <div
                className="w-full flex-grow rounded-lg border shadow-sm"
                style={{ backgroundColor: hexColor }}
              ></div>
              
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="p-4 rounded-md border" style={{ backgroundColor: hexColor }}>
                  <span className="font-medium" style={{ 
                    color: rgbColor.r + rgbColor.g + rgbColor.b > 380 ? 'black' : 'white' 
                  }}>
                    Text on Color
                  </span>
                </div>
                <div className="p-4 rounded-md border bg-background">
                  <span className="font-medium" style={{ color: hexColor }}>
                    Color as Text
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimatedElement>
  );
};

export default HexRgbConverter;
