import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface RadioSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function RadioSearch({ searchTerm, setSearchTerm }: RadioSearchProps) {
  return (
    <div className="mb-6 relative">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        className="pr-10 h-12 bg-slate-900/50 border-slate-800 focus:border-amber-500 rounded-xl text-lg"
        placeholder="ابحث عن إذاعة أو قارئ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
