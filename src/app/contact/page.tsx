'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '60px 0 80px' }}>
        <div className="container" style={{ maxWidth: '920px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ marginBottom: '16px' }}>Biz bilan bog'laning</h1>
            <p className="text-secondary">Savollaringiz bormi? Mutaxassislarimiz yordam berishga tayyor.</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="card">
              <h3 style={{ marginBottom: '20px' }}>Aloqa ma'lumotlari</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-muted" />
                  <div>
                    <p className="text-xs text-muted">Elektron pochta:</p>
                    <p className="font-semibold text-sm">support@cashbridge.uz</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-muted" />
                  <div>
                    <p className="text-xs text-muted">Telefon raqam:</p>
                    <p className="font-semibold text-sm">+998 71 200 45 45</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Send size={20} className="text-muted" />
                  <div>
                    <p className="text-xs text-muted">Telegram:</p>
                    <p className="font-semibold text-sm">@cashbridge_support_bot</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-muted" />
                  <div>
                    <p className="text-xs text-muted">Manzil:</p>
                    <p className="font-semibold text-sm">Toshkent shahri, Mirobod tumani, Nukus ko'chasi 29-uy</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              {sent ? (
                <div className="flex flex-col items-center justify-center text-center gap-3" style={{ height: '100%', padding: '20px' }}>
                  <CheckCircle size={48} style={{ color: 'var(--accent-green)' }} />
                  <h3>Xabaringiz yuborildi!</h3>
                  <p className="text-sm text-secondary">Tez orada operatorimiz siz bilan bog'lanadi.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ marginBottom: '16px' }}>Xabar yuborish</h3>
                  <div className="form-group">
                    <label className="form-label">Ismingiz *</label>
                    <input type="text" required placeholder="Dilshod" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email yoki telefon *</label>
                    <input type="text" required placeholder="dilshod@kompaniya.uz" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Xabar matni *</label>
                    <textarea rows={4} required placeholder="Savolingizni yozing..." className="form-textarea" />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Jo'natish
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
