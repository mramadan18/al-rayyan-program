import { LucideIcon, ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AzkarCategoryCardProps {
  category: {
    id: string;
    title: string;
    icon: LucideIcon;
    color: string;
    bg: string;
    count: number;
  };
  onClick?: () => void;
}

export function AzkarCategoryCard({
  category,
  onClick,
}: AzkarCategoryCardProps) {
  const Icon = category.icon;

  return (
    <Card
      onClick={onClick}
      className="group hover:shadow-lg transition-all duration-300 border-none bg-card hover:bg-accent/5 cursor-pointer overflow-hidden relative"
    >
      {/* Decorative background glow */}
      <div
        className={cn(
          "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity",
          category.bg.replace("/10", "/30"),
        )}
      />

      <CardContent className="p-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center translate-z-0",
              category.bg,
              category.color,
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-quran mb-1 group-hover:text-primary transition-colors">
              {category.title}
            </h3>
            <p className="text-sm text-muted-foreground font-sans">
              {category.count} ذكر
            </p>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="hidden group-hover:flex">
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
