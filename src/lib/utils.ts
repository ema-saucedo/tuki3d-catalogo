import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price);
}

export function normalizeCategory(category: string): string {
  if (!category) return '';
  const trimmed = category.trim();
  const lower = trimmed.toLowerCase();
  
  if (lower === 'decoración' || lower === 'decoracion') return 'Coleccionables';
  if (lower === 'llaveros' || lower === 'llavero') return 'Multimedia';
  if (lower === 'personalizados' || lower === 'personalizado') return 'Otros';
  
  return trimmed;
}
