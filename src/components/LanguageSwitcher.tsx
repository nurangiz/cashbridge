'use client';

import React from 'react';
import { useApp, Locale } from '@/context/AppContext';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, setLocale } = useApp();

  const options: { code: Locale; label: string; flag: string }[] = [
    { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <div className="flex items-center gap-1">
      <Globe size={16} className="text-muted" />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        aria-label="Tilni tanlash"
        style={{
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '4px 8px',
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          cursor: 'pointer',
        }}
      >
        {options.map((opt) => (
          <option key={opt.code} value={opt.code} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
            {opt.flag} {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
