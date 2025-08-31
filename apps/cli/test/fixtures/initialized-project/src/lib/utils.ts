import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for combining Tailwind CSS classes with intelligent merging
 * 
 * This function combines clsx for conditional class application with tailwind-merge
 * for intelligent Tailwind class deduplication and conflict resolution.
 * 
 * @example
 * cn('px-4', 'px-2') // Returns 'px-2' (latest value wins)
 * cn('text-red-500', undefined, 'text-blue-500') // Returns 'text-blue-500'
 * cn('hover:bg-red-500', { 'bg-blue-500': isActive }) // Conditional application
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
