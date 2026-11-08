'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useApp();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="btn btn-ghost btn-sm"
      style={{ padding: '6px', borderRadius: 'var(--radius-sm)' }}
      title={theme === 'light' ? 'Tungi rejim' : 'Kunduzgi rejim'}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon size={18} className="text-secondary" />
      ) : (
        <Sun size={18} style={{ color: '#fbbf24' }} />
      )}
    </button>
  );
}
