import { WifiOff, RefreshCw } from "lucide-react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface NetworkErrorBannerProps {
  /** Optional error state from an API call or other source */
  hasApiError?: boolean;
  /** Custom title override */
  title?: string;
  /** Custom description override */
  description?: string;
  /** Whether to show the action button (Reload) */
  showAction?: boolean;
  /** Custom action callback (defaults to window location reload) */
  onAction?: () => void;
  /** Additional className for the container */
  className?: string;
}

export function NetworkErrorBanner({
  hasApiError = false,
  title,
  description,
  showAction = true,
  onAction,
  className,
}: NetworkErrorBannerProps) {
  const { isOnline, isMounted } = useNetworkStatus();

  // Prevent hydration mismatch by not rendering anything until mounted if we depend on client-side status
  if (!isMounted) return null;

  // Show banner if offline OR if there's an API error
  const shouldShow = !isOnline || hasApiError;

  if (!shouldShow) return null;

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      window.location.reload();
    }
  };

  const defaultTitle = !isOnline
    ? "لا يوجد اتصال بالإنترنت"
    : "حدث خطأ في الاتصال";
  const defaultDescription = !isOnline
    ? "أنت الآن تعمل في وضع الأوفلاين، بعض الخدمات مثل إذاعة القرآن ومواقيت الصلاة قد لا تكون محدثة."
    : "يرجى التأكد من تشغيل الإنترنت لتحديث البيانات والمواقيت.";

  return (
    <div
      dir="rtl"
      className={cn(
        "bg-red-500/10 border border-red-500/20 text-white p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500 shadow-lg backdrop-blur-sm gap-4",
        className,
      )}
    >
      <div className="flex items-center gap-4 text-right w-full lg:w-auto">
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
          <WifiOff className="w-6 h-6 text-red-500" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-red-500 text-lg flex items-center gap-2">
            {title || defaultTitle}
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </span>
          <span className="text-sm text-slate-300 mt-0.5 max-w-xl">
            {description || defaultDescription}
          </span>
        </div>
      </div>

      {showAction && (
        <Button
          onClick={handleAction}
          className="w-full md:w-auto px-6 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}
