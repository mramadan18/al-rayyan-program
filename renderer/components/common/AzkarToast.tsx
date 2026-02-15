import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";

interface AzkarToastProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const AzkarToast: React.FC<AzkarToastProps> = ({
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) setTimeout(onClose, 500); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-background/80 backdrop-blur-lg border border-primary/20 p-4 rounded-xl shadow-2xl max-w-sm pointer-events-auto"
        >
          <div className="shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Bell className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium leading-tight text-foreground/90 pr-4">
            {message}
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
