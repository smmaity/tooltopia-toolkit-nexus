
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
  onClick?: () => void;
  color?: string;
  gradient?: {
    from: string;
    to: string;
  };
  style?: React.CSSProperties;
}

const ToolCard = ({
  icon: Icon,
  title,
  description,
  className,
  onClick,
  color = "bg-tooltopia-purple",
  gradient,
  style,
}: ToolCardProps) => {
  const gradientClasses = gradient
    ? `from-${gradient.from} to-${gradient.to}`
    : "";

  return (
    <div
      className={cn(
        "tool-card flex flex-col items-center text-center cursor-pointer",
        className
      )}
      onClick={onClick}
      style={style}
    >
      <div
        className={cn(
          "w-16 h-16 rounded-2xl flex-center mb-4",
          color,
          gradientClasses
        )}
      >
        <Icon size={32} className="text-primary-foreground" />
      </div>
      <h3 className="font-medium text-xl mb-2">{title}</h3>
      {description && <p className="text-muted-foreground text-sm">{description}</p>}
    </div>
  );
};

export default ToolCard;
