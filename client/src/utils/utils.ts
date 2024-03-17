import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function renderSubString(string: string) {
  return string.replace(/(_\d+)/g, "<sub>$&</sub>").replace(/_/g, "");
}

export function generateRandomId(): string {
  const randomDigits = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return `Q-${randomDigits}`;
}