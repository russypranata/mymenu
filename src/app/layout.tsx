import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Poppins, Playfair_Display, Space_Grotesk, Nunito, DM_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mymenu.id'

export const metadata: Metadata = {
  title: {
    default: "MyMenu — Menu Digital untuk UMKM Kuliner",
    template: "%s — MyMenu",
  },
  description: "Buat menu digital untuk warung, kafe, atau restoran Anda dalam 5 menit. Lengkap dengan QR Code, keranjang order WhatsApp, dan link yang bisa langsung dibagikan.",
  metadataBase: new URL(appUrl),
  keywords: ['menu digital', 'menu online', 'UMKM', 'warung', 'kafe', 'restoran', 'QR code menu', 'menu WhatsApp'],
  authors: [{ name: 'MyMenu' }],
  creator: 'MyMenu',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: appUrl,
    siteName: 'MyMenu',
    title: 'MyMenu — Menu Digital untuk UMKM Kuliner',
    description: 'Buat menu digital untuk warung, kafe, atau restoran Anda dalam 5 menit.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyMenu — Menu Digital untuk UMKM Kuliner',
    description: 'Buat menu digital untuk warung, kafe, atau restoran Anda dalam 5 menit.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${plusJakarta.variable} ${poppins.variable} ${playfair.variable} ${spaceGrotesk.variable} ${nunito.variable} ${dmSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
