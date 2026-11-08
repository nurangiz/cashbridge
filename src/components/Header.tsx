'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { Bell, Search } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  const { t } = useApp();

  return (
    <header className="app-topbar">
      <div>
        {title && <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{title}</h1>}
        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Search size={15} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder={t('common.search')}
            style={{
              paddingLeft: '32px',
              paddingRight: '12px',
              paddingTop: '6px',
              paddingBottom: '6px',
              fontSize: '0.8125rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              width: '180px',
            }}
          />
        </div>

        {action && <div>{action}</div>}

        <div style={{ height: '24px', width: '1px', background: 'var(--border)' }} />

        <LanguageSwitcher />
        <ThemeToggle />

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          style={{ position: 'relative', padding: '6px' }}
          title="Bildirishnomalar"
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-red)',
            }}
          />
        </button>
      </div>
    </header>
  );
}
