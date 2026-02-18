import Link from "next/link";
import { useRouter } from "next/router";
import {
  Home,
  BookOpen,
  Scroll,
  Settings,
  Radio,
  Moon,
  Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "الرئيسية", icon: Home, href: "/home" },
  { label: "المصحف", icon: BookOpen, href: "/quran" },
  { label: "الإذاعة", icon: Radio, href: "/radio" }, // New Radio Page
  { label: "إمساكية", icon: Moon, href: "/ramadan" }, // New Ramadan Page
  { label: "الزكاة", icon: Calculator, href: "/zakat" }, // New Zakat Page
  { label: "الأذكار", icon: Scroll, href: "/azkar" },
  { label: "الإعدادات", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const router = useRouter();

  return (
    <aside className="fixed top-8 right-0 bottom-0 w-56 bg-sidebar border-l border-sidebar-border flex flex-col items-center py-6 z-40 bg-card/50 backdrop-blur-sm">
      {/* Logo Area */}
      <div className="mb-8 text-center select-none">
        <h1 className="text-3xl font-bold text-primary font-quran drop-shadow-sm">
          الريّان
        </h1>
        <p className="text-[10px] text-muted-foreground mt-1 opacity-70">
          رفيقك الإيماني
        </p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 w-full px-3 space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = router.pathname.startsWith(item.href);
          return (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start gap-4 text-base h-12 font-medium transition-all duration-200 relative overflow-hidden group/btn",
                isActive
                  ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary shadow-sm ring-1 ring-primary/20"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground hover:translate-x-1",
              )}
            >
              <Link href={item.href}>
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary rounded-l-full" />
                )}
                <item.icon
                  className={cn(
                    "w-6 h-6 text-2xl transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover/btn:text-foreground",
                  )}
                />
                <span className="font-sans pt-0.5">{item.label}</span>
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* Footer / Version */}
      <div className="mt-auto pb-4 w-full px-6">
        <div className="text-sm text-center text-muted-foreground/40 font-mono">
          v{process.env.APP_VERSION || "1.0.0"}
        </div>
      </div>
    </aside>
  );
}
