import { MoveLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuranCompletionCardProps {
  progress: number;
  surahName: string;
  verseNumber: number;
  onContinue: () => void;
}

export function QuranCompletionCard({
  progress,
  surahName,
  verseNumber,
  onContinue,
}: QuranCompletionCardProps) {
  return (
    <Card className="h-full border-none shadow-lg bg-card text-card-foreground flex flex-col group">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          ختم القرآن الكريم
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/20"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              className="text-primary transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{progress}%</span>
          </div>
        </div>

        <div className="text-center space-y-1">
          <p className="text-muted-foreground text-sm">آخر قراءة</p>
          <p className="text-xl font-semibold font-quran">{surahName}</p>
          <p className="text-xs text-muted-foreground">الآية {verseNumber}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-6 px-6">
        <Button
          onClick={onContinue}
          className="w-full gap-2 text-lg h-12 shadow-md hover:shadow-lg transition-all group-hover:gap-4"
          size="lg"
        >
          متابعة الختم
          <MoveLeft className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
