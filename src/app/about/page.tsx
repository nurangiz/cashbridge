'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ShieldCheck, Target, Users2, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '60px 0 80px' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <h1 style={{ marginBottom: '16px' }}>CashBridge haqida</h1>
          <p className="text-secondary" style={{ fontSize: '1.15rem', marginBottom: '40px' }}>
            Biz kichik va o'rta biznes egalariga qarz undirish bilan bog'liq noqulayliklarni yo'qotish va barqaror pul oqimini ta'minlashda yordam beramiz.
          </p>

          <div className="grid grid-cols-2 gap-6" style={{ marginBottom: '40px' }}>
            <div className="card">
              <div style={{ color: 'var(--accent-blue)', marginBottom: '12px' }}><Target size={28} /></div>
              <h3 style={{ marginBottom: '8px' }}>Bizning Missiya</h3>
              <p className="text-sm text-secondary">
                O'zbekiston va Markaziy Osiyo B2B bozorida to'lov madaniyatini oshirish, hisob-fakturalarni o'z vaqtida yopilishini 80% gacha yetkazish.
              </p>
            </div>

            <div className="card">
              <div style={{ color: 'var(--accent-green)', marginBottom: '12px' }}><Zap size={28} /></div>
              <h3 style={{ marginBottom: '8px' }}>Nima uchun CashBridge?</h3>
              <p className="text-sm text-secondary">
                Bizneslar kassa uzilishiga tushmasligi uchun aqlli eslatmalar va kassa prognozini bir tizimga birlashtirgan birinchi milliy B2B SaaS platformamiz.
              </p>
            </div>
          </div>

          <div className="card" style={{ padding: '30px' }}>
            <h3 style={{ marginBottom: '12px' }}>Xavfsizlik va Maxfiylik</h3>
            <p className="text-sm text-secondary" style={{ lineHeight: 1.7 }}>
              Har bir kompaniyaning ma'lumotlari PostgreSQL Row Level Security (RLS) orqali to'liq himoyalangan. Sizning mijozlaringiz, faktura summalari va shartnomalaringiz faqat sizning hisobingizga ko'rinadi.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
