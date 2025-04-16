
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface RgbInputProps {
  rgbColor: { r: number; g: number; b: number };
  handleRgbChange: (component: "r" | "g" | "b", value: number) => void;
  updateHexFromRgb: () => void;
  copyToClipboard: (text: string, type: string) => void;
}

const RgbInput: React.FC<RgbInputProps> = ({
  rgbColor,
  handleRgbChange,
  updateHexFromRgb,
  copyToClipboard,
}) => {
  return (
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
            onChange={(e) => handleRgbChange("r", parseInt(e.target.value))}
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
            onChange={(e) => handleRgbChange("g", parseInt(e.target.value))}
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
            onChange={(e) => handleRgbChange("b", parseInt(e.target.value))}
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
  );
};

export default RgbInput;
