'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WaitlistModal } from '@/components/WaitlistModal';
import { useApp } from '@/context/AppContext';
import { Check, X } from 'lucide-react';

export default function PricingPage() {
  const { t } = useApp();
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenWaitlist={() => setWaitlistOpen(true)} />

      <main style={{ flex: 1, padding: '60px 0 80px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 50px' }}>
            <h1 style={{ marginBottom: '16px' }}>{t('landing.pricing.title')}</h1>
            <p className="text-secondary">{t('landing.pricing.subtitle')}</p>
          </div>

          {/* Pricing Comparison Table */}
          <div className="table-responsive" style={{ maxWidth: '960px', margin: '0 auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>Imkoniyatlar</th>
                  <th style={{ width: '20%', textAlign: 'center' }}>Free (0 so'm)</th>
                  <th style={{ width: '20%', textAlign: 'center', background: 'var(--accent-green-bg)', color: 'var(--accent-green-text)' }}>
                    Pro ($19/oy)
                  </th>
                  <th style={{ width: '20%', textAlign: 'center' }}>Business ($59/oy)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold">Oylik hisob-fakturalar soni</td>
                  <td style={{ textAlign: 'center' }}>5 tagacha</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>100 tagacha</td>
                  <td style={{ textAlign: 'center' }}>Cheksiz</td>
                </tr>
                <tr>
                  <td className="font-semibold">Telegram Bot eslatmalari</td>
                  <td style={{ textAlign: 'center' }}><X size={16} className="text-muted" style={{ display: 'inline' }} /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} style={{ color: 'var(--accent-green)', display: 'inline' }} /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} style={{ color: 'var(--accent-green)', display: 'inline' }} /></td>
                </tr>
                <tr>
                  <td className="font-semibold">Resend Email eslatmalari</td>
                  <td style={{ textAlign: 'center' }}><Check size={18} style={{ color: 'var(--accent-green)', display: 'inline' }} /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} style={{ color: 'var(--accent-green)', display: 'inline' }} /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} style={{ color: 'var(--accent-green)', display: 'inline' }} /></td>
                </tr>
                <tr>
                  <td className="font-semibold">Mijoz ishonchlilik reytingi (0-100)</td>
                  <td style={{ textAlign: 'center' }}><Check size={18} style={{ color: 'var(--accent-green)', display: 'inline' }} /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} style={{ color: 'var(--accent-green)', display: 'inline' }} /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} style={{ color: 'var(--accent-green)', display: 'inline' }} /></td>
                </tr>
                <tr>
                  <td className="font-semibold">30 kunlik Pul oqimi prognozi</td>
                  <td style={{ textAlign: 'center' }}><X size={16} className="text-muted" style={{ display: 'inline' }} /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} style={{ color: 'var(--accent-green)', display: 'inline' }} /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} style={{ color: 'var(--accent-green)', display: 'inline' }} /></td>
                </tr>
                <tr>
                  <td className="font-semibold">Professional PDF eksport</td>
                  <td style={{ textAlign: 'center' }}><Check size={18} style={{ color: 'var(--accent-green)', display: 'inline' }} /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} style={{ color: 'var(--accent-green)', display: 'inline' }} /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} style={{ color: 'var(--accent-green)', display: 'inline' }} /></td>
                </tr>
                <tr>
                  <td className="font-semibold">Shaxsiy Telegram bot tokeni ulash</td>
                  <td style={{ textAlign: 'center' }}><X size={16} className="text-muted" style={{ display: 'inline' }} /></td>
                  <td style={{ textAlign: 'center' }}><X size={16} className="text-muted" style={{ display: 'inline' }} /></td>
                  <td style={{ textAlign: 'center' }}><Check size={18} style={{ color: 'var(--accent-green)', display: 'inline' }} /></td>
                </tr>
                <tr>
                  <td></td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>
                    <button onClick={() => setWaitlistOpen(true)} className="btn btn-outline btn-sm">
                      Tanlash
                    </button>
                  </td>
                  <td style={{ textAlign: 'center', padding: '16px', background: 'var(--accent-green-bg)' }}>
                    <button onClick={() => setWaitlistOpen(true)} className="btn btn-accent btn-sm">
                      Pro boshlash
                    </button>
                  </td>
                  <td style={{ textAlign: 'center', padding: '16px' }}>
                    <button onClick={() => setWaitlistOpen(true)} className="btn btn-primary btn-sm">
                      Bog'lanish
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
      <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </div>
  );
}
