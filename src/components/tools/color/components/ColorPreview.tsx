
import React from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ColorPreviewProps {
  hexColor: string;
  rgbColor: { r: number; g: number; b: number };
  hslColor: { h: number; s: number; l: number };
  copyToClipboard: (text: string, type: string) => void;
}

const ColorPreview: React.FC<ColorPreviewProps> = ({
  hexColor,
  rgbColor,
  hslColor,
  copyToClipboard,
}) => {
  return (
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
  );
};

export default ColorPreview;
