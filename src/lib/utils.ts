import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
