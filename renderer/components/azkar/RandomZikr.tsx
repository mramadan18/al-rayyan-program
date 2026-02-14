import { Card, CardContent } from "@/components/ui/card";

interface RandomZikrProps {
  text: string;
  merit?: string;
}

export function RandomZikr({ text, merit }: RandomZikrProps) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-4 font-quran">ذكر عشوائي</h2>
      <Card className="bg-linear-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="p-8 text-center space-y-6">
          <p className="text-3xl md:text-4xl leading-loose font-quran text-foreground/90">
            "{text}"
          </p>
          {merit && (
            <div className="text-sm text-muted-foreground bg-background/50 inline-block px-4 py-1 rounded-full border">
              {merit}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
