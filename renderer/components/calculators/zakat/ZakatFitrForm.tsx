import { Users, DollarSign } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ZakatFitrFormProps {
  familyMembers: string;
  setFamilyMembers: (v: string) => void;
  fitrAmount: string;
  setFitrAmount: (v: string) => void;
  currency: string;
}

export function ZakatFitrForm({
  familyMembers,
  setFamilyMembers,
  fitrAmount,
  setFitrAmount,
  currency,
}: ZakatFitrFormProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
        <div className="space-y-2">
          <Label htmlFor="members" className="text-foreground font-medium">
            عدد أفراد الأسرة
          </Label>
          <div className="relative group">
            <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-amber-500 transition-colors" />
            <Input
              id="members"
              type="number"
              placeholder="1"
              className="pr-10 h-11 bg-background border-border focus-visible:ring-amber-500 text-lg"
              value={familyMembers}
              onChange={(e) => setFamilyMembers(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fitr-amount" className="text-foreground font-medium">
            مقدار الفطرة للفرد ({currency})
          </Label>
          <div className="relative group">
            <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-amber-500 transition-colors" />
            <Input
              id="fitr-amount"
              type="number"
              placeholder="35"
              className="pr-10 h-11 bg-background border-border focus-visible:ring-amber-500"
              value={fitrAmount}
              onChange={(e) => setFitrAmount(e.target.value)}
            />
          </div>
        </div>
      </div>
      <p className="text-xs text-center text-muted-foreground bg-muted/30 py-2 rounded-lg">
        يتم تحديد مقدار زكاة الفطر سنوياً من قبل الجهات المختصة.
      </p>
    </div>
  );
}
