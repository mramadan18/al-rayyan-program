"use client";

import { toast } from "sonner";
import { Moon, Star } from "lucide-react";

interface AzkarToastProps {
  title?: string;
  description: string;
}

// Function to trigger the custom toast
export function showAzkarToast({
  title = "ذكر اليوم",
  description,
}: AzkarToastProps) {
  toast.custom(
    (t) => (
      <div className="bg-slate-900 border-r-4 border-amber-500 rounded-lg shadow-xl p-4 w-[350px] flex gap-4 items-start relative overflow-hidden dir-rtl">
        {/* Decorative Icon */}
        <div className="bg-amber-500/10 p-2 rounded-full mt-1">
          <Moon className="w-5 h-5 text-amber-500" />
        </div>

        <div className="flex-1 space-y-1">
          <h3 className="font-bold text-amber-500 font-quran text-lg">
            {title}
          </h3>
          <p className="text-slate-100 text-sm leading-relaxed font-sans">
            {description}
          </p>
        </div>

        {/* Background glow or pattern could be added here */}
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
          <Star className="w-24 h-24 rotate-45" />
        </div>
      </div>
    ),
    {
      duration: 5000,
      position: "bottom-left",
    },
  );
}

// Default export component not needed since we export a function,
// but we can provide a button to demo it if imported as a component.
export default function AzkarDemoButton() {
  return (
    <button
      onClick={() =>
        showAzkarToast({
          title: "تسبيح",
          description: "سبحان الله و بحمده، سبحان الله العظيم",
        })
      }
      className="px-4 py-2 bg-slate-900 text-amber-500 rounded-md border border-amber-500/20 hover:bg-slate-800 transition-colors"
    >
      عينة إشعار الأذكار
    </button>
  );
}
