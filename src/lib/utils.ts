import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ATELIER_EASE = [0.16, 1, 0.3, 1] as const;
export const ATELIER_SPRING = { type: "spring" as const, stiffness: 280, damping: 26, mass: 0.8 };
export const ATELIER_SNAPPY_SPRING = { type: "spring" as const, stiffness: 420, damping: 30 };

