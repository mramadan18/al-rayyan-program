import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// Helper to remove Arabic diacritics (Tashkeel)
export function removeTashkeel(text: string) {
  return text.replace(/[\u064B-\u065F\u0670]/g, "");
}
