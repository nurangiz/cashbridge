'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '60px 0 80px' }}>
        <div className="container" style={{ maxWidth: '820px' }}>
          <h1 style={{ marginBottom: '20px' }}>Foydalanish shartlari (Terms of Service)</h1>
          <p className="text-xs text-muted" style={{ marginBottom: '30px' }}>Amal qilish muddati: 2026-yil</p>

          <div className="card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: 1.7 }}>
            <div>
              <h3 style={{ marginBottom: '8px' }}>1. Xizmat tavsifi</h3>
              <p className="text-sm text-secondary">
                CashBridge B2B SaaS veb-platformasi bo'lib, hisob-fakturalar to'lovini nazorat qilish, avtomatlashtirilgan eslatmalar yuborish va 30 kunlik pul oqimini bashorat qilish xizmatini taqdim etadi.
              </p>
            </div>

            <div>
              <h3 style={{ marginBottom: '8px' }}>2. Foydalanuvchi majburiyatlari</h3>
              <p className="text-sm text-secondary">
                Foydalanuvchi hisob qaydnomasining xavfsizligini ta'minlash, kiritilayotgan kontragentlar va fakturalarning to'g'riligiga javobgardir. Tizim orqali spam yoki qonunga xilof xabarlar yuborish taqiqlanadi.
              </p>
            </div>

            <div>
              <h3 style={{ marginBottom: '8px' }}>3. To'lovlar va obuna</h3>
              <p className="text-sm text-secondary">
                Pullik tariflar (Pro, Business) oylik yoki yillik obuna asosida faollashtiriladi. Obunani istalgan paytda to'xtatish mumkin.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
