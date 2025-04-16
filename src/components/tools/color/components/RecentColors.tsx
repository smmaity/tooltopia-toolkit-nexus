
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface RecentColorsProps {
  recentColors: string[];
  onSelectColor: (color: string) => void;
}

const RecentColors: React.FC<RecentColorsProps> = ({
  recentColors,
  onSelectColor,
}) => {
  if (recentColors.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <Label className="mb-3 block">Recent Colors</Label>
        <div className="grid grid-cols-8 gap-2">
          {recentColors.map((color, index) => (
            <div
              key={index}
              className="w-full aspect-square rounded-md cursor-pointer border"
              style={{ backgroundColor: color }}
              onClick={() => onSelectColor(color)}
              title={color}
            ></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentColors;
