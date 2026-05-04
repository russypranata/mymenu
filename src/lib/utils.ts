import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Theme / font helpers ──

export const FONT_MAP: Record<string, string> = {
  poppins:  'font-poppins',
  playfair: 'font-playfair',
  space:    'font-space',
  nunito:   'font-nunito',
  dm:       'font-dm',
  serif:    'font-serif',
  mono:     'font-mono',
  sans:     'font-sans',
}

export function getFontClass(font: string): string {
  return FONT_MAP[font] ?? 'font-sans'
}

export const TEXT_SIZE_MAP: Record<string, string> = {
  sm: 'text-sm',
  lg: 'text-lg',
  md: 'text-base',
}

export function getTextSizeClass(size: string): string {
  return TEXT_SIZE_MAP[size] ?? 'text-base'
}

export const BORDER_RADIUS_MAP: Record<string, string> = {
  sharp:   'rounded-none',
  pill:    'rounded-full',
  rounded: 'rounded-xl',
}

export function getBorderRadiusClass(radius: string): string {
  return BORDER_RADIUS_MAP[radius] ?? 'rounded-xl'
}

export type BackgroundPattern = 'dots' | 'grid' | 'waves' | 'none'

const VALID_PATTERNS: BackgroundPattern[] = ['dots', 'grid', 'waves', 'none']

/**
 * Validates and returns the background pattern identifier.
 * The actual CSS is rendered in PublicMenuWrapper with dark-mode-aware opacity,
 * so we only pass the identifier here — not a Tailwind class string.
 */
export function getBackgroundPattern(pattern: string): BackgroundPattern {
  return VALID_PATTERNS.includes(pattern as BackgroundPattern)
    ? (pattern as BackgroundPattern)
    : 'none'
}

/**
 * Returns a luminance-based contrast check.
 * Returns 'dark' if the color is light (use dark text on it),
 * 'light' if the color is dark (use light text on it).
 */
export function getContrastColor(hex: string): 'dark' | 'light' {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  // Relative luminance (WCAG formula)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? 'dark' : 'light'
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatWhatsAppMessage(storeName: string, menuItems: { name: string; quantity: number }[]): string {
  const itemsList = menuItems.map(item => `- ${item.quantity}x ${item.name}`).join('\n')
  return `Halo ${storeName}, saya mau pesan:\n\n${itemsList}\n\nTerima kasih!`
}

export function getWhatsAppLink(whatsappNumber: string, message: string): string {
  // Remove all non-digit characters except leading +
  const cleanNumber = whatsappNumber.replace(/[^\d+]/g, '').replace(/\++/g, '+')
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
}

export function formatWhatsAppNumber(phone: string): string {
  // Ensure number starts with + if it doesn't already
  if (!phone.startsWith('+')) {
    return `+${phone}`
  }
  return phone
}
