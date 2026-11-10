import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ATELIER_EASE = [0.22, 1, 0.36, 1] as const;
export const ATELIER_SPRING = { type: "spring" as const, bounce: 0, duration: 0.42 };
export const ATELIER_SNAPPY_SPRING = { type: "spring" as const, bounce: 0.08, duration: 0.34 };
