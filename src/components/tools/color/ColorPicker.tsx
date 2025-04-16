
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedElement from "@/components/animated-element";

import HexInput from "./components/HexInput";
import RgbInput from "./components/RgbInput";
import HslInput from "./components/HslInput";
import ColorPreview from "./components/ColorPreview";
import RecentColors from "./components/RecentColors";
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from "./utils/colorConversion";

import "./colorPicker.css";

const ColorPicker = () => {
  const [hexColor, setHexColor] = useState("#1e88e5");
  const [rgbColor, setRgbColor] = useState({ r: 30, g: 136, b: 229 });
  const [hslColor, setHslColor] = useState({ h: 210, s: 79, l: 51 });
  const [recentColors, setRecentColors] = useState<string[]>([]);

  useEffect(() => {
    updateRgbFromHex();
  }, []);

  const updateRgbFromHex = () => {
    const rgb = hexToRgb(hexColor);
    if (rgb) {
      setRgbColor(rgb);
      
      // Convert RGB to HSL
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHslColor(hsl);
    }
  };

  const updateHexFromRgb = () => {
    const hex = rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b);
    setHexColor(hex);
    
    // Convert RGB to HSL
    const hsl = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b);
    setHslColor(hsl);
    
    addToRecentColors(hex);
  };

  const updateFromHsl = () => {
    const rgb = hslToRgb(hslColor.h, hslColor.s, hslColor.l);
    setRgbColor(rgb);
    
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setHexColor(hex);
    
    addToRecentColors(hex);
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

  const handleSelectRecentColor = (color: string) => {
    setHexColor(color);
    updateRgbFromHex();
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
                  <HexInput 
                    hexColor={hexColor}
                    setHexColor={setHexColor}
                    updateRgbFromHex={updateRgbFromHex}
                    addToRecentColors={addToRecentColors}
                    copyToClipboard={copyToClipboard}
                  />
                </TabsContent>
                
                <TabsContent value="rgb" className="space-y-4">
                  <RgbInput 
                    rgbColor={rgbColor}
                    handleRgbChange={handleRgbChange}
                    updateHexFromRgb={updateHexFromRgb}
                    copyToClipboard={copyToClipboard}
                  />
                </TabsContent>
                
                <TabsContent value="hsl" className="space-y-4">
                  <HslInput 
                    hslColor={hslColor}
                    handleHslChange={handleHslChange}
                    updateFromHsl={updateFromHsl}
                    copyToClipboard={copyToClipboard}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <RecentColors 
            recentColors={recentColors} 
            onSelectColor={handleSelectRecentColor} 
          />
        </div>

        <Card>
          <CardContent className="p-6">
            <ColorPreview 
              hexColor={hexColor}
              rgbColor={rgbColor}
              hslColor={hslColor}
              copyToClipboard={copyToClipboard}
            />
          </CardContent>
        </Card>
      </div>
    </AnimatedElement>
  );
};

export default ColorPicker;
