import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: "CashBridge — B2B to'lov eslatmalari va 30 kunlik pul oqimi prognozi",
  description:
    "Kichik va o'rta bizneslar uchun avtomatlashtirilgan to'lov eslatmalari (Telegram + Email), mijozlar ishonchlilik reytingi va kassa uzilishini oldini oluvchi 30 kunlik kassa prognozi.",
  keywords: [
    'CashBridge',
    'hisob-faktura',
    'b2b saas',
    'pul oqimi',
    'cash flow',
    'kassa uzilishi',
    "telegram to'lov eslatmasi",
    'buxgalteriya',
    'moliya',
  ],
  authors: [{ name: 'CashBridge Team' }],
  openGraph: {
    title: "CashBridge — O'z vaqtida to'lov oling, kassa uzilishini unuting",
    description: "B2B hisob-fakturalar to'lovi intizomini oshiring va naqd pul oqimini aniq bashorat qiling.",
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
