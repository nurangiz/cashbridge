'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  BellRing,
  TrendingUp,
  Settings,
  ShieldCheck,
  LogOut,
  Building2,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { t, company } = useApp();

  const navItems = [
    { href: '/dashboard', label: t('common.dashboard'), icon: LayoutDashboard },
    { href: '/invoices', label: t('common.invoices'), icon: FileText },
    { href: '/clients', label: t('common.clients'), icon: Users },
    { href: '/reminders', label: t('common.reminders'), icon: BellRing },
    { href: '/forecast', label: t('common.forecast'), icon: TrendingUp },
    { href: '/settings', label: t('common.settings'), icon: Settings },
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <Link href="/" className="flex items-center gap-2">
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
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
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Company Info & User Status in Bottom */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <Building2 size={18} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p className="text-sm font-semibold" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {company.name}
            </p>
            <p className="text-xs text-muted">STIR: {company.tax_id}</p>
          </div>
        </div>

        <Link
          href="/"
          className="btn btn-ghost btn-sm"
          style={{ justifyContent: 'flex-start', color: 'var(--accent-red)' }}
        >
          <LogOut size={16} />
          <span>{t('common.logout')}</span>
        </Link>
      </div>
    </aside>
  );
}
