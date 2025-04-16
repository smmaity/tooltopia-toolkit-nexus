
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface HexInputProps {
  hexColor: string;
  setHexColor: (color: string) => void;
  updateRgbFromHex: () => void;
  addToRecentColors: (color: string) => void;
  copyToClipboard: (text: string, type: string) => void;
}

const HexInput: React.FC<HexInputProps> = ({
  hexColor,
  setHexColor,
  updateRgbFromHex,
  addToRecentColors,
  copyToClipboard,
}) => {
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setHexColor(newColor);
    if (/^#([A-Fa-f0-9]{6})$/.test(newColor)) {
      updateRgbFromHex();
      addToRecentColors(newColor);
    }
  };

  return (
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
  );
};

export default HexInput;
