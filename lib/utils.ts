import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

export const focusInput = "focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none";

export const hasErrorInput = "border-red-500 ring-1 ring-red-500 text-red-600 placeholder:text-red-400 focus:border-red-500 focus:ring-red-500";

export const formatters = {
  default: (value: any) => String(value),
  currency: (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  },
  date: (value: string | Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
  },
  number: (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  }
};
