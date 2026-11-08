'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, CheckCircle, ShieldCheck } from 'lucide-react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const { t, addWaitlistLead } = useApp();
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) return;

    addWaitlistLead({
      full_name: fullName,
      company_name: companyName,
      email,
      phone,
    });
    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-secondary" />
            <h3 style={{ fontSize: '1.15rem' }}>
              {submitted ? "Arizangiz qabul qilindi!" : t('landing.cta.joinWaitlist')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {submitted ? (
            <div className="flex flex-col items-center text-center gap-3" style={{ padding: '20px 0' }}>
              <CheckCircle size={48} style={{ color: 'var(--accent-green)' }} />
              <h3>Rahmat, {fullName}!</h3>
              <p className="text-sm text-secondary">
                Sizning so'rovingiz qabul qilindi. <strong>{email}</strong> manziliga yaqin vaqt ichida dastlabki sinov platformasiga kirish havolasi va 3 oylik bepul Pro tarif kodi yuboriladi.
              </p>
              <button onClick={onClose} className="btn btn-primary" style={{ marginTop: '16px' }}>
                Tushunarli
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="text-sm text-muted" style={{ marginBottom: '20px' }}>
                {t('landing.hero.waitlistNotice')}. Ma'lumotlaringizni qoldiring va birinchilardan bo'lib foydalaning.
              </p>

              <div className="form-group">
                <label className="form-label">Ism va familiya *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Sardor Rustamov"
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kompaniya nomi</label>
                <input
                  type="text"
                  placeholder="Masalan: Express Logistics MCHJ"
                  className="form-input"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Elektron pochta *</label>
                <input
                  type="email"
                  required
                  placeholder="sardor@logistics.uz"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Telefon raqam</label>
                <input
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={onClose} className="btn btn-outline">
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn btn-accent">
                  {t('landing.cta.joinWaitlist')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
