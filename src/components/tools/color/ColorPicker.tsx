
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { Copy } from "lucide-react";
import AnimatedElement from "@/components/animated-element";

const ColorPicker = () => {
  const [hexColor, setHexColor] = useState("#1e88e5");
  const [rgbColor, setRgbColor] = useState({ r: 30, g: 136, b: 229 });
  const [hslColor, setHslColor] = useState({ h: 210, s: 79, l: 51 });
  const [recentColors, setRecentColors] = useState<string[]>([]);

  useEffect(() => {
    updateRgbFromHex();
  }, []);

  const updateRgbFromHex = () => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      setRgbColor({ r, g, b });
      
      // Convert RGB to HSL
      const hsl = rgbToHsl(r, g, b);
      setHslColor(hsl);
    }
  };

  const updateHexFromRgb = () => {
    const hex = `#${componentToHex(rgbColor.r)}${componentToHex(rgbColor.g)}${componentToHex(rgbColor.b)}`;
    setHexColor(hex);
    
    // Convert RGB to HSL
    const hsl = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b);
    setHslColor(hsl);
    
    addToRecentColors(hex);
  };

  const updateFromHsl = () => {
    const rgb = hslToRgb(hslColor.h, hslColor.s, hslColor.l);
    setRgbColor(rgb);
    
    const hex = `#${componentToHex(rgb.r)}${componentToHex(rgb.g)}${componentToHex(rgb.b)}`;
    setHexColor(hex);
    
    addToRecentColors(hex);
  };

  const componentToHex = (c: number): string => {
    const hex = Math.max(0, Math.min(255, c)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h *= 60;
    }

    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return { 
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setHexColor(newColor);
    if (/^#([A-Fa-f0-9]{6})$/.test(newColor)) {
      updateRgbFromHex();
      addToRecentColors(newColor);
    }
  };

  const handleRgbChange = (component: 'r' | 'g' | 'b', value: number) => {
    const newValue = Math.max(0, Math.min(255, value));
    setRgbColor({ ...rgbColor, [component]: newValue });
  };

  const handleHslChange = (component: 'h' | 's' | 'l', value: number) => {
    const maxValues = { h: 360, s: 100, l: 100 };
    const newValue = Math.max(0, Math.min(maxValues[component], value));
    setHslColor({ ...hslColor, [component]: newValue });
  };

  const addToRecentColors = (color: string) => {
    setRecentColors((prev) => {
      if (!prev.includes(color)) {
        return [color, ...prev].slice(0, 8);
      }
      return prev;
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success(`${type} copied to clipboard!`);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <AnimatedElement>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardContent className="p-6 space-y-6">
              <Tabs defaultValue="hex" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="hex">HEX</TabsTrigger>
                  <TabsTrigger value="rgb">RGB</TabsTrigger>
                  <TabsTrigger value="hsl">HSL</TabsTrigger>
                </TabsList>
                
                <TabsContent value="hex" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hex">HEX Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={hexColor}
                        onChange={(e) => {
                          setHexColor(e.target.value);
                          updateRgbFromHex();
                          addToRecentColors(e.target.value);
                        }}
                        className="w-12 h-10 p-1"
                      />
                      <div className="relative flex-1">
                        <Input
                          id="hex"
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
                </TabsContent>
                
                <TabsContent value="rgb" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rgb-r">RGB Values</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label htmlFor="rgb-r" className="text-xs text-muted-foreground">
                          R: {rgbColor.r}
                        </Label>
                        <Input
                          id="rgb-r"
                          type="range"
                          min="0"
                          max="255"
                          value={rgbColor.r}
                          onChange={(e) => handleRgbChange('r', parseInt(e.target.value))}
                          className="accent-red-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rgb-g" className="text-xs text-muted-foreground">
                          G: {rgbColor.g}
                        </Label>
                        <Input
                          id="rgb-g"
                          type="range"
                          min="0"
                          max="255"
                          value={rgbColor.g}
                          onChange={(e) => handleRgbChange('g', parseInt(e.target.value))}
                          className="accent-green-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rgb-b" className="text-xs text-muted-foreground">
                          B: {rgbColor.b}
                        </Label>
                        <Input
                          id="rgb-b"
                          type="range"
                          min="0"
                          max="255"
                          value={rgbColor.b}
                          onChange={(e) => handleRgbChange('b', parseInt(e.target.value))}
                          className="accent-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="relative">
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
                    
                    <Button onClick={updateHexFromRgb} size="sm" className="w-full">
                      Apply
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="hsl" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hsl-h">HSL Values</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label htmlFor="hsl-h" className="text-xs text-muted-foreground">
                          H: {hslColor.h}°
                        </Label>
                        <Input
                          id="hsl-h"
                          type="range"
                          min="0"
                          max="360"
                          value={hslColor.h}
                          onChange={(e) => handleHslChange('h', parseInt(e.target.value))}
                          className="hue-range"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hsl-s" className="text-xs text-muted-foreground">
                          S: {hslColor.s}%
                        </Label>
                        <Input
                          id="hsl-s"
                          type="range"
                          min="0"
                          max="100"
                          value={hslColor.s}
                          onChange={(e) => handleHslChange('s', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="hsl-l" className="text-xs text-muted-foreground">
                          L: {hslColor.l}%
                        </Label>
                        <Input
                          id="hsl-l"
                          type="range"
                          min="0"
                          max="100"
                          value={hslColor.l}
                          onChange={(e) => handleHslChange('l', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Input
                        value={`hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`}
                        readOnly
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        onClick={() => copyToClipboard(`hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`, "HSL color")}
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                    
                    <Button onClick={updateFromHsl} size="sm" className="w-full">
                      Apply
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {recentColors.length > 0 && (
            <Card className="mt-6">
              <CardContent className="p-6">
                <Label className="mb-3 block">Recent Colors</Label>
                <div className="grid grid-cols-8 gap-2">
                  {recentColors.map((color, index) => (
                    <div
                      key={index}
                      className="w-full aspect-square rounded-md cursor-pointer border"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setHexColor(color);
                        updateRgbFromHex();
                      }}
                      title={color}
                    ></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div
                className="w-full aspect-square rounded-lg border shadow-sm"
                style={{ backgroundColor: hexColor }}
              ></div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">HEX</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => copyToClipboard(hexColor, "HEX color")}
                  >
                    {hexColor} <Copy size={12} className="ml-1" />
                  </Button>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium">RGB</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => copyToClipboard(`rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`, "RGB color")}
                  >
                    rgb({rgbColor.r}, {rgbColor.g}, {rgbColor.b}) <Copy size={12} className="ml-1" />
                  </Button>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium">HSL</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => copyToClipboard(`hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`, "HSL color")}
                  >
                    hsl({hslColor.h}, {hslColor.s}%, {hslColor.l}%) <Copy size={12} className="ml-1" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="block">Color Preview</Label>
                <div className="space-y-2">
                  <div className="flex h-10 items-center px-4 rounded-md" style={{ backgroundColor: hexColor }}>
                    <span className="font-medium" style={{ color: hslColor.l > 60 ? '#000' : '#fff' }}>
                      Text on this color
                    </span>
                  </div>
                  
                  <div className="flex h-10 items-center px-4 rounded-md bg-background">
                    <span className="font-medium" style={{ color: hexColor }}>
                      This color as text
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <style jsx>{`
        .hue-range {
          background: linear-gradient(
            to right,
            red, orange, yellow, green, cyan, blue, violet
          );
        }
      `}</style>
    </AnimatedElement>
  );
};

export default ColorPicker;
