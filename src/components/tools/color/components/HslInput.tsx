
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface HslInputProps {
  hslColor: { h: number; s: number; l: number };
  handleHslChange: (component: "h" | "s" | "l", value: number) => void;
  updateFromHsl: () => void;
  copyToClipboard: (text: string, type: string) => void;
}

const HslInput: React.FC<HslInputProps> = ({
  hslColor,
  handleHslChange,
  updateFromHsl,
  copyToClipboard,
}) => {
  return (
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
            onChange={(e) => handleHslChange("h", parseInt(e.target.value))}
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
            onChange={(e) => handleHslChange("s", parseInt(e.target.value))}
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
            onChange={(e) => handleHslChange("l", parseInt(e.target.value))}
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
  );
};

export default HslInput;
