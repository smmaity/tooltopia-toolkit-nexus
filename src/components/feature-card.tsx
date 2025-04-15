
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  style?: React.CSSProperties;
}

const FeatureCard = ({ icon: Icon, title, description, className, style }: FeatureCardProps) => {
  return (
    <div className={cn("flex flex-col items-start space-y-4", className)} style={style}>
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex-center">
        <Icon size={28} className="text-primary" />
      </div>
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
