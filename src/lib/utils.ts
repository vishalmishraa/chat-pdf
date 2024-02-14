import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToAscii(inputString: string) {
  //return any non ascii charechter
  const asciiString = inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, "-");
  return asciiString;
} 