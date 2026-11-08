'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { generate30DayForecast } from '@/lib/forecast';
import {
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

export default function ForecastPage() {
  const { t, locale, invoices, clients, company } = useApp();

  const clientsMap = React.useMemo(() => {
    const map: Record<string, any> = {};
    clients.forEach((c) => (map[c.id] = c));
    return map;
  }, [clients]);

  const forecast = React.useMemo(() => {
    return generate30DayForecast(invoices, clientsMap);
  }, [invoices, clientsMap]);

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-main">
        <Header
          title={t('forecastPage.title')}
          subtitle={t('forecastPage.subtitle')}
        />

        <main className="app-content">
          {/* Key metrics banner */}
          <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '24px' }}>
            <div className="stat-card">
              <span className="stat-label">30 kunlik kutilayotgan sof tushum</span>
              <span className="stat-value" style={{ color: 'var(--accent-green)' }}>
                {formatCurrency(forecast.totalExpectedNext30Days, company.currency)}
              </span>
              <span className="text-xs text-muted">Mijozlar to'lov intizomiga moslashtirilgan</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Muddati o'tgan xavfli qarzdorlik</span>
              <span className="stat-value" style={{ color: 'var(--accent-red)' }}>
                {formatCurrency(forecast.totalCurrentlyOverdue, company.currency)}
              </span>
              <span className="text-xs" style={{ color: 'var(--accent-red)' }}>
                Kassa uzilishi xavfini tug'diruvchi qarzlar
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Bashorat ishonchlilik darajasi</span>
              <span className="stat-value" style={{ color: 'var(--accent-blue)' }}>
                {forecast.confidenceScore}%
              </span>
              <span className="text-xs text-muted">Sun'iy intellekt va to'lovlar tarixi asosida</span>
            </div>
          </div>

          {/* Risk Alerts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <div
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-green-bg)',
                border: '1px solid var(--accent-green)',
                color: 'var(--accent-green-text)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <ShieldCheck size={20} />
              <span className="font-semibold text-sm">{t('forecastPage.safeZone')}</span>
            </div>

            <div
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-amber-bg)',
                border: '1px solid var(--accent-amber)',
                color: 'var(--accent-amber-text)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <AlertTriangle size={20} />
              <span className="font-semibold text-sm">{t('forecastPage.attentionNeeded')}</span>
            </div>
          </div>

          {/* Forecast Chart */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">Kunlik tushumlar taqsimoti (Keyingi 30 kun)</h3>
                <p className="card-subtitle">Qaysi kunlarda qancha summa tushishi prognozi</p>
              </div>
            </div>

            <div className="chart-bars-container">
              {forecast.dailyForecast.map((day, i) => {
                const maxAmount = 90000000;
                const heightPercent = Math.max(8, Math.min(100, (day.expectedAmount / maxAmount) * 100));
                const isOverdue = day.overdueAmount > 0;

                return (
                  <div key={i} className="chart-bar-group" title={`${day.date}: ${formatCurrency(day.expectedAmount, company.currency)}`}>
                    {day.expectedAmount > 0 ? (
                      <div
                        className={`chart-bar-pillar ${isOverdue ? 'has-overdue' : ''}`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '4px',
                          background: 'var(--border)',
                          borderRadius: '2px',
                        }}
                      />
                    )}
                    {i % 3 === 0 && <span className="chart-bar-label">{day.dayLabel}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expected Inflows Timetable */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
              <h3 className="card-title">Kutilayotgan to'lovlar jadvali</h3>
              <p className="card-subtitle">Kunlar kesimida rejalashtirilgan to'lovlar</p>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Sana</th>
                    <th>Faktura</th>
                    <th>Mijoz</th>
                    <th>Holat</th>
                    <th style={{ textAlign: 'right' }}>Kutilayotgan summa</th>
                  </tr>
                </thead>
                <tbody>
                  {forecast.dailyForecast
                    .filter((d) => d.invoices.length > 0)
                    .map((d) =>
                      d.invoices.map((item, idx) => (
                        <tr key={`${d.date}-${idx}`}>
                          <td className="font-semibold text-xs">{d.date} ({d.dayLabel})</td>
                          <td className="font-bold text-sm" style={{ color: 'var(--accent-blue)' }}>{item.number}</td>
                          <td>{item.clientName}</td>
                          <td>
                            <span className={`badge ${item.status === 'overdue' ? 'badge-danger' : 'badge-info'}`}>
                              {item.status === 'overdue' ? "Kechikkan" : "Kutilmoqda"}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-green)' }}>
                            {formatCurrency(item.amount, company.currency)}
                          </td>
                        </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
