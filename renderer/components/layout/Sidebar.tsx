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
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useAutoUpdater } from "@/hooks/useAutoUpdater";

const NAV_ITEMS = [
  { label: "الرئيسية", icon: Home, href: "/home" },
  { label: "المصحف", icon: BookOpen, href: "/quran" },
  { label: "الإذاعة", icon: Radio, href: "/radio" },
  { label: "إمساكية", icon: Moon, href: "/ramadan" },
  { label: "الزكاة", icon: Calculator, href: "/zakat" },
  { label: "الأذكار", icon: Scroll, href: "/azkar" },
  { label: "الإعدادات", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const router = useRouter();
  const { status, checkForUpdate } = useAutoUpdater();

  return (
    <aside className="fixed top-8 right-0 bottom-0 w-20 bg-sidebar border-l border-sidebar-border flex flex-col items-center py-6 z-40 bg-card/60 backdrop-blur-md shadow-2xl">
      {/* Logo Area */}
      <div className="mb-10 text-center select-none cursor-default">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group transition-all duration-500 hover:rotate-12">
          <span className="text-2xl font-bold text-primary font-quran drop-shadow-sm group-hover:scale-110 transition-transform">
            ر
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 w-full px-3 space-y-4">
        {NAV_ITEMS.map((item) => {
          const isActive = router.pathname.startsWith(item.href);
          return (
            <Tooltip key={item.href} content={item.label} side="left">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className={cn(
                  "w-full h-12 rounded-xl transition-all duration-300 relative group/btn py-2",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary hover:scale-110",
                )}
              >
                <Link
                  href={item.href}
                  className="flex items-center justify-center w-full h-full"
                >
                  <item.icon
                    className={cn(
                      "size-5 transition-transform duration-300 group-hover/btn:scale-110",
                      isActive
                        ? "text-primary-foreground group-hover/btn:text-muted-foreground"
                        : "text-muted-foreground group-hover/btn:text-primary",
                    )}
                  />
                  {isActive && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-l-full shadow-lg shadow-primary/40" />
                  )}
                </Link>
              </Button>
            </Tooltip>
          );
        })}
      </nav>

      {/* Footer / Version */}
      <div className="mt-auto pb-4 w-full flex flex-col items-center gap-2 select-none">
        <div className="h-px w-8 bg-border/50 mb-2" />
        <Tooltip content="التحقق من وجود تحديثات" side="left">
          <button
            onClick={checkForUpdate}
            disabled={status === "checking" || status === "downloading"}
            className={cn(
              "text-[11px] text-muted-foreground/60 font-mono font-medium tracking-tight bg-accent/50 px-2 py-0.5 rounded-full border border-border/50 transition-all hover:bg-accent hover:text-primary active:scale-95 disabled:opacity-50",
              status === "checking" && "text-primary border-primary/30",
            )}
          >
            {status === "checking" ? (
              <RefreshCw className="size-3 animate-spin" />
            ) : (
              `v${process.env.APP_VERSION || "1.2.0"}`
            )}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
