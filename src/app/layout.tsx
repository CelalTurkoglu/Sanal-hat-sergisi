import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rahmet Ayında Aile — Hüsn-ü Hat Sergisi",
  description: "\"Rahmet Ayında Aile\" Hüsn-ü Hat Sergisi. 18 Şubat Çarşamba, Saat 11:00 — İstanbul İl Milli Eğitim Müdürlüğü Sergi Salonu'nda eserleri keşfedin.",
  keywords: ["hüsn-ü hat", "hat sanatı", "kaligrafi", "İslami sanat", "sergi", "Rahmet Ayında Aile", "İstanbul", "İl Milli Eğitim Müdürlüğü"],
  openGraph: {
    title: "Rahmet Ayında Aile — Hüsn-ü Hat Sergisi",
    description: "\"Rahmet Ayında Aile\" Hüsn-ü Hat Sergisi — 18 Şubat Çarşamba, Saat 11:00 | İstanbul İl Milli Eğitim Müdürlüğü Sergi Salonu",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable} ${notoNaskh.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
