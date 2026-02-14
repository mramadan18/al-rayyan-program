import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Home,
  BookOpen,
  Scroll,
  LayoutGrid,
  Settings,
  Minus,
  Square,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { label: "الرئيسية", icon: Home, href: "/home" },
  { label: "المصحف", icon: BookOpen, href: "/quran" },
  { label: "الأذكار", icon: Scroll, href: "/azkar" },
  { label: "المرافق", icon: LayoutGrid, href: "/features" },
  { label: "الإعدادات", icon: Settings, href: "/settings" },
];

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  // Hide sidebar on specific routes like Quran reader if needed (Phase 3 requirement)
  const isMinimal = router.pathname === "/quran";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans dir-rtl">
      {/* Custom Title Bar Area (Draggable) */}
      <div className="fixed top-0 left-0 right-0 h-8 z-50 flex items-center justify-between px-2 w-full select-none app-drag-region">
        {/* Window Controls (Left side for Mac-like feel, or Right for Windows) */}
        {/* Since we are using a custom title bar, we need to handle window controls via IPC or just UI for now. 
              The prompt asked for macOS-style traffic lights on the left/right. 
              Let's put them on the left for a modern feel unless OS specific instructions say otherwise. */}
        <div className="flex items-center gap-2 px-2 no-drag">
          <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer" />
        </div>
        <div className="text-xs text-muted-foreground font-medium">الريّان</div>
        <div className="w-16" /> {/* Spacer */}
      </div>

      {/* Main Content Area */}
      <main
        className={cn(
          "flex-1 pt-8 h-full overflow-hidden transition-all duration-300",
          // If sidebar is present, add margin or execute layout logic
          !isMinimal ? "mr-64" : "",
        )}
      >
        <div className="h-full w-full overflow-auto scrollbar-hide">
          {children}
        </div>
      </main>

      {/* Persistent Right Sidebar */}
      {!isMinimal && (
        <aside className="fixed top-8 right-0 bottom-0 w-64 bg-sidebar border-l border-sidebar-border flex flex-col items-center py-6 z-40">
          {/* Logo Area */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-primary font-quran">
              الريّان
            </h1>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 w-full px-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className="block w-full">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 text-base h-12 font-medium transition-all duration-200",
                      isActive
                        ? "bg-accent/10 text-primary border-r-2 border-primary rounded-none shadow-sm"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Footer / Version */}
          <div className="mt-auto pb-4 text-xs text-muted-foreground opacity-50">
            v1.0.0
          </div>
        </aside>
      )}
      <Toaster />
    </div>
  );
}
