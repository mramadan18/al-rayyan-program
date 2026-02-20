"use strict";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export function Tooltip({
  children,
  content,
  side = "right",
  className,
}: TooltipProps) {
  const [show, setShow] = React.useState(false);

  const sideVariants = {
    top: { bottom: "115%", left: "50%", x: "-50%", y: 5 },
    bottom: { top: "115%", left: "50%", x: "-50%", y: -5 },
    left: { right: "115%", top: "50%", y: "-50%", x: 5 },
    right: { left: "115%", top: "50%", y: "-50%", x: -5 },
  };

  const animationVariants = {
    initial: { opacity: 0, scale: 0.9, ...sideVariants[side] },
    animate: {
      opacity: 1,
      scale: 1,
      x: side === "right" || side === "left" ? 0 : sideVariants[side].x,
      y: side === "top" || side === "bottom" ? 0 : sideVariants[side].y,
    },
    exit: { opacity: 0, scale: 0.9, ...sideVariants[side] },
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animationVariants}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl whitespace-nowrap pointer-events-none select-none",
              className,
            )}
            style={{ direction: "rtl" }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
