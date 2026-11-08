'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Mail, Phone, Send } from 'lucide-react';

export function Footer() {
  const { t } = useApp();

  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)', padding: '60px 0 30px' }}>
      <div className="container">
        <div className="grid grid-cols-4 gap-8" style={{ marginBottom: '40px' }}>
          {/* Col 1: Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #0f2b46 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Cash<span style={{ color: 'var(--accent-green)' }}>Bridge</span>
              </span>
            </div>
            <p className="text-sm text-muted">
              {t('common.tagline')}. Kichik va o'rta bizneslar uchun avtomatlashtirilgan moliya intizomi platformasi.
            </p>
          </div>

          {/* Col 2: Mahsulot */}
          <div className="flex flex-col gap-2">
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '8px' }}>Mahsulot</h4>
            <a href="#features" className="text-sm text-muted">Imkoniyatlar</a>
            <a href="#how-it-works" className="text-sm text-muted">Qanday ishlaydi?</a>
            <a href="#pricing" className="text-sm text-muted">Narxlar va tariflar</a>
            <Link href="/dashboard" className="text-sm text-muted">Jonli demo panel</Link>
          </div>

          {/* Col 3: Hujjatlar */}
          <div className="flex flex-col gap-2">
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '8px' }}>Ma'lumot</h4>
            <Link href="/about" className="text-sm text-muted">Biz haqimizda</Link>
            <Link href="/contact" className="text-sm text-muted">Aloqa va qo'llab-quvvatlash</Link>
            <Link href="/privacy" className="text-sm text-muted">Maxfiylik siyosati</Link>
            <Link href="/terms" className="text-sm text-muted">Foydalanish shartlari</Link>
          </div>

          {/* Col 4: Kontaktlar */}
          <div className="flex flex-col gap-2">
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '8px' }}>Aloqa</h4>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Mail size={16} />
              <span>support@cashbridge.uz</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Phone size={16} />
              <span>+998 71 200 45 45</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Send size={16} />
              <span>@cashbridge_support_bot</span>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} CashBridge Inc. Barcha huquqlar himoyalangan. O'zbekiston.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span>Toshkent sh., Mirobod t.</span>
            <span>STIR: 309876543</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
