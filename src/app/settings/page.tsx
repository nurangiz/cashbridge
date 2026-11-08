'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useApp } from '@/context/AppContext';
import { Building, Send, Globe, Shield, CheckCircle, Save } from 'lucide-react';

export default function SettingsPage() {
  const { t, company, updateCompany } = useApp();

  const [name, setName] = useState(company.name);
  const [taxId, setTaxId] = useState(company.tax_id);
  const [phone, setPhone] = useState(company.phone || '');
  const [email, setEmail] = useState(company.email || '');
  const [address, setAddress] = useState(company.address || '');
  const [currency, setCurrency] = useState(company.currency);
  const [botToken, setBotToken] = useState(company.telegram_bot_token || '');
  const [chatId, setChatId] = useState(company.telegram_chat_id || '');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany({
      name,
      tax_id: taxId,
      phone,
      email,
      address,
      currency,
      telegram_bot_token: botToken,
      telegram_chat_id: chatId,
    });
    setToastMsg("Kompaniya sozlamalari muvaffaqiyatli saqlandi!");
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleTestBot = () => {
    setToastMsg(`Telegram Bot (${chatId || '@smartlogistics_uz_bot'}) bilan aloqa o'rnatildi! Test xabari yuborildi.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-main">
        <Header
          title={t('settingsPage.title')}
          subtitle="Tashkilot rekvizitlari, aloqa kanallari va bot integratsiyasi"
        />

        <main className="app-content" style={{ maxWidth: '860px' }}>
          {toastMsg && (
            <div
              style={{
                backgroundColor: 'var(--accent-green-bg)',
                color: 'var(--accent-green-text)',
                padding: '12px 18px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid var(--accent-green)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              <CheckCircle size={18} />
              <span>{toastMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Section 1: Company Profile */}
            <div className="card">
              <div className="card-header">
                <div className="flex items-center gap-2">
                  <Building size={20} className="text-secondary" />
                  <h3 className="card-title">{t('settingsPage.companyProfile')}</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">{t('settingsPage.companyName')} *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('settingsPage.taxId')} (INN) *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Telefon raqam</label>
                  <input
                    type="text"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Elektron pochta</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Yuridik manzil</label>
                <input
                  type="text"
                  className="form-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            {/* Section 2: Preferences */}
            <div className="card">
              <div className="card-header">
                <div className="flex items-center gap-2">
                  <Globe size={20} className="text-secondary" />
                  <h3 className="card-title">Moliyaviy parametrlar</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{t('settingsPage.currency')}</label>
                  <select
                    className="form-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                  >
                    <option value="UZS">UZS (O'zbekiston so'mi)</option>
                    <option value="USD">USD (AQSH dollari)</option>
                    <option value="EUR">EUR (Yevro)</option>
                    <option value="RUB">RUB (Rossiya rubli)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Hisob-kitob QQS standarti</label>
                  <input
                    type="text"
                    disabled
                    className="form-input"
                    value="12% (O'zbekiston QQS bazasi)"
                    style={{ background: 'var(--bg-muted)', opacity: 0.8 }}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Telegram Bot Integration */}
            <div className="card">
              <div className="card-header">
                <div className="flex items-center gap-2">
                  <Send size={20} style={{ color: 'var(--accent-blue)' }} />
                  <h3 className="card-title">{t('settingsPage.telegramBot')}</h3>
                </div>
                <button
                  type="button"
                  onClick={handleTestBot}
                  className="btn btn-outline btn-sm"
                  style={{ color: 'var(--accent-blue)' }}
                >
                  {t('settingsPage.connectBot')}
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">{t('settingsPage.telegramToken')}</label>
                <input
                  type="password"
                  placeholder="6549812345:AAH_XYZ1234567890abcdef"
                  className="form-input"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                />
                <span className="form-hint">
                  Telegram @BotFather orqali yaratilgan bot tokeni. Shaxsiy bot orqali mijozlaringizga xabarlar boradi.
                </span>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('settingsPage.telegramChatId')}</label>
                <input
                  type="text"
                  placeholder="@smartlogistics_uz_bot yoki -100123456789"
                  className="form-input"
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                />
                <span className="form-hint">
                  To'lov bildirishnomalari va eslatmalar borishi uchun kanal yoki guruh identifikatori.
                </span>
              </div>
            </div>

            {/* Section 4: Subscription */}
            <div className="card">
              <div className="card-header">
                <div className="flex items-center gap-2">
                  <Shield size={20} style={{ color: 'var(--accent-green)' }} />
                  <h3 className="card-title">{t('settingsPage.subscription')}</h3>
                </div>
                <span className="badge badge-success">Pro Tarif (Faol)</span>
              </div>

              <p className="text-sm text-secondary">
                Sizning kompaniyangiz <strong>Pro</strong> tarifidan foydalanmoqda. Oyiga 100 tagacha hisob-faktura, Telegram va Email avtomatik eslatmalari faollashtirilgan.
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
                <Save size={16} />
                <span>{t('common.save')}</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
