'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenWaitlist?: () => void;
}

export function Navbar({ onOpenWaitlist }: NavbarProps) {
  const { t } = useApp();

  return (
    <header className="public-header">
      <div className="container flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0f2b46 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Cash<span style={{ color: 'var(--accent-green)' }}>Bridge</span>
          </span>
        </Link>

        {/* Public Navigation Links */}
        <nav className="flex items-center gap-6" style={{ display: 'flex' }}>
          <a href="#how-it-works" className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Qanday ishlaydi?
          </a>
          <a href="#features" className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Imkoniyatlar
          </a>
          <a href="#pricing" className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Narxlar
          </a>
          <a href="#faq" className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            FAQ
          </a>
        </nav>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/dashboard" className="btn btn-outline btn-sm">
            {t('common.signIn')}
          </Link>
          <button
            onClick={onOpenWaitlist}
            type="button"
            className="btn btn-accent btn-sm"
          >
            <span>{t('landing.hero.ctaPrimary')}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
