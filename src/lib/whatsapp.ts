/**
 * Send WhatsApp notification via Fonnte API
 * Docs: https://docs.fonnte.com/send-message/
 */
export async function sendWhatsApp(phone: string, message: string): Promise<void> {
  const token = process.env.FONNTE_TOKEN
  if (!token || !phone) return

  // Normalize phone: remove leading 0, ensure starts with country code
  const normalized = phone.replace(/^0/, '62').replace(/\D/g, '')

  try {
    await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        target: normalized,
        message,
        countryCode: '62',
      }),
    })
  } catch (err) {
    // Non-blocking — log but don't throw
    console.error('[sendWhatsApp]', err)
  }
}

// ── Message templates ──────────────────────────────────────────────────────

export function msgTrialActive(name: string, expiresAt: string): string {
  return `Halo ${name}! 👋

Selamat datang di *MyMenu*! Trial gratis 7 hari Anda sudah aktif.

✅ Masa trial berakhir: *${expiresAt}*

Selama trial, Anda bisa menikmati semua fitur MyMenu secara penuh. Buat toko dan menu digital Anda sekarang!

🔗 Login: ${process.env.NEXT_PUBLIC_APP_URL}/login

_Butuh bantuan? Hubungi kami kapan saja._`
}

export function msgTrialExpiringSoon(name: string, daysLeft: number, expiresAt: string): string {
  return `Halo ${name}! ⏰

Masa trial MyMenu Anda akan berakhir dalam *${daysLeft} hari* (${expiresAt}).

Untuk melanjutkan menggunakan MyMenu, silakan hubungi kami untuk informasi pembayaran.

💬 Hubungi admin: ${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ? `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP}` : 'hubungi admin'}

Jangan sampai toko digital Anda tidak aktif! 🙏`
}

export function msgTrialExpired(name: string): string {
  return `Halo ${name},

Masa trial MyMenu Anda telah *berakhir*. Akses ke dashboard sementara dibatasi.

Untuk mengaktifkan kembali, silakan hubungi admin:
💬 ${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ? `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP}` : 'hubungi admin'}

Kami siap membantu Anda melanjutkan perjalanan bisnis digital! 🚀`
}

export function msgSubscriptionActivated(name: string, expiresAt: string): string {
  return `Halo ${name}! 🎉

Langganan MyMenu Anda telah *diaktifkan*!

✅ Aktif hingga: *${expiresAt}*

Selamat menggunakan MyMenu. Toko digital Anda kini kembali aktif dan bisa diakses pelanggan.

🔗 Dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

Terima kasih telah mempercayai MyMenu! 🙏`
}
