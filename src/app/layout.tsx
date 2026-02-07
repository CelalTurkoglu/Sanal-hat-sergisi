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
  title: "Hat Sanatı Sergisi | Celal",
  description: "Geleneksel hat sanatının modern dijital sunumu. 40 özgün eserin yer aldığı sergiyi keşfedin.",
  keywords: ["hat sanatı", "kaligrafi", "İslami sanat", "sergi", "Celal"],
  authors: [{ name: "Celal" }],
  openGraph: {
    title: "Hat Sanatı Sergisi | Celal",
    description: "Geleneksel hat sanatının modern dijital sunumu",
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
