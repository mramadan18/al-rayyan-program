import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { TitleBar } from "@/components/layout/TitleBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Suspense } from "react";
import { PlayerTimesProvider } from "@/contexts/player-times";
import { UpdateModal } from "@/components/common/UpdateModal";
import { LocationModal } from "@/components/common/LocationModal";
import { useWindowZoom } from "@/hooks/use-window-zoom";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Initialize zoom shortcuts
  useWindowZoom();

  // Hide sidebar on specific routes like Quran reader if needed (Phase 3 requirement)

  return (
    <PlayerTimesProvider>
      <div
        className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans"
        dir="rtl"
      >
        {/* Custom Title Bar Area (Draggable) */}
        <TitleBar />

        {/* Main Content Area */}
        <main
          className={cn(
            "flex-1 pt-8 h-full overflow-hidden transition-all duration-300 relative z-20 mr-20",
          )}
          dir="rtl"
        >
          <div
            id="main-scroll-container"
            className="h-full w-full overflow-auto scrollbar-hide"
            dir="rtl"
          >
            {children}
          </div>
        </main>

        <Sidebar />
        <Toaster />
        <UpdateModal />
        <LocationModal />
      </div>
    </PlayerTimesProvider>
  );
}
