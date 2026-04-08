import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// Helper to remove Arabic diacritics (Tashkeel)
export function removeTashkeel(text: string) {
  return text.replace(/[\u064B-\u065F\u0670]/g, "");
}

/**
 * Robust copy to clipboard utility for Electron.
 * Bypasses navigator.clipboard permission issues by using main process IPC.
 */
export async function copyToClipboard(text: string) {
  if (typeof window !== "undefined" && window.ipc) {
    window.ipc.send("clipboard-write", text);
    return true;
  }

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.error("Fallback copy failed:", err);
  }
  return false;
}
