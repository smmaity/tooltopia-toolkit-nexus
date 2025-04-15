
import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("font-bold text-2xl flex items-center gap-2", className)}>
      <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center">
        <span className="text-primary-foreground text-lg">T</span>
      </div>
      <span>Tooltopia</span>
    </div>
  );
};

export default Logo;
