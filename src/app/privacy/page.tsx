'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '60px 0 80px' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <h1 style={{ marginBottom: '20px' }}>Maxfiylik siyosati (Privacy Policy)</h1>
          <p className="text-xs text-muted" style={{ marginBottom: '30px' }}>So'nggi yangilanish: 2026-yil noyabr</p>

          <div className="card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: 1.7 }}>
            <div>
              <h3 style={{ marginBottom: '8px' }}>1. Umumiy qoidalar</h3>
              <p className="text-sm text-secondary">
                CashBridge ("biz") foydalanuvchilarning shaxsiy va korporativ ma'lumotlari maxfiyligini hurmat qiladi va ularni himoya qilishni o'zining ustuvor vazifasi deb biladi. Ushbu siyosat platformadan foydalanishda qanday ma'lumotlar to'planishi va ishlatilishini tushuntiradi.
              </p>
            </div>

            <div>
              <h3 style={{ marginBottom: '8px' }}>2. To'planadigan ma'lumotlar</h3>
              <p className="text-sm text-secondary">
                Platformadan foydalanganda kompaniya nomi, STIR (INN), aloqa ma'lumotlari (telefon, email, Telegram ID) hamda kiritilgan hisob-fakturalar rekvizitlari saqlanadi. Ushbu ma'lumotlar faqat to'lov eslatmalarini yuborish va kassa prognozini hisoblash uchun xizmat qiladi.
              </p>
            </div>

            <div>
              <h3 style={{ marginBottom: '8px' }}>3. Ma'lumotlar xavfsizligi va RLS</h3>
              <p className="text-sm text-secondary">
                Barcha ma'lumotlar shifrlangan holda saqlanadi va PostgreSQL Row Level Security (RLS) orqali to'liq izolyatsiya qilingan. Boshqa foydalanuvchilar sizning kompaniyangiz ma'lumotlariga kira olmaydi.
              </p>
            </div>

            <div>
              <h3 style={{ marginBottom: '8px' }}>4. Uchinchi shaxslarga berilmasligi</h3>
              <p className="text-sm text-secondary">
                Sizning moliyaviy ma'lumotlaringiz, kontragentlaringiz va debitorlik hisoblaringiz hech qanday uchinchi tomon yoki reklama tarmoqlariga sotilmaydi yoki topshirilmaydi.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
