'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate, getInvoiceStatusLabel, getReliabilityTier } from '@/lib/utils';
import { generate30DayForecast } from '@/lib/forecast';
import { InvoiceCreateModal } from '@/components/InvoiceCreateModal';
import { InvoiceDetailModal } from '@/components/InvoiceDetailModal';
import { RecordPaymentModal } from '@/components/RecordPaymentModal';
import { Invoice } from '@/types/database';
import {
  Wallet,
  AlertTriangle,
  TrendingUp,
  Clock,
  Plus,
  Send,
  Eye,
  CheckCircle,
  FileText,
  Users,
} from 'lucide-react';

export default function DashboardPage() {
  const { t, locale, invoices, clients, company, sendReminder } = useApp();

  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Map clients
  const clientsMap = React.useMemo(() => {
    const map: Record<string, any> = {};
    clients.forEach((c) => (map[c.id] = c));
    return map;
  }, [clients]);

  // Compute 30-day forecast and financial totals
  const forecast = React.useMemo(() => {
    return generate30DayForecast(invoices, clientsMap);
  }, [invoices, clientsMap]);

  // Financial KPIs
  let totalOutstanding = 0;
  let totalOverdue = 0;
  let delayDaysSum = 0;
  let lateClientsCount = 0;

  invoices.forEach((inv) => {
    const remaining = Math.max(0, Number(inv.total_amount) - Number(inv.paid_amount || 0));
    if (inv.status !== 'paid') {
      totalOutstanding += remaining;
    }
    if (inv.status === 'overdue') {
      totalOverdue += remaining;
    }
  });

  clients.forEach((c) => {
    if (c.avg_delay_days > 0) {
      delayDaysSum += c.avg_delay_days;
      lateClientsCount++;
    }
  });

  const avgDso = lateClientsCount > 0 ? (delayDaysSum / lateClientsCount).toFixed(1) : '0';

  // Top late payers
  const topLatePayers = [...clients]
    .filter((c) => c.avg_delay_days > 0 || c.reliability_score < 70)
    .sort((a, b) => a.reliability_score - b.reliability_score)
    .slice(0, 5);

  const handleQuickReminder = async (invoiceId: string) => {
    const res = await sendReminder(invoiceId, 'telegram');
    setToastMsg(res.message);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-main">
        <Header
          title={t('dashboard.title')}
          subtitle={`${company.name} • ${company.currency}`}
          action={
            <button
              onClick={() => setCreateInvoiceOpen(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus size={16} />
              <span>{t('dashboard.createInvoice')}</span>
            </button>
          }
        />

        <main className="app-content">
          {/* Toast Message */}
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

          {/* 4 Main KPI Cards */}
          <div className="grid grid-cols-4 gap-6" style={{ marginBottom: '24px' }}>
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <span className="stat-label">{t('dashboard.totalOutstanding')}</span>
                <div className="stat-icon-wrapper" style={{ background: 'var(--accent-blue-bg)', color: 'var(--accent-blue)' }}>
                  <Wallet size={22} />
                </div>
              </div>
              <div className="stat-value">{formatCurrency(totalOutstanding, company.currency)}</div>
              <span className="text-xs text-muted">Barcha kutilayotgan fakturalar</span>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between">
                <span className="stat-label">{t('dashboard.overdueAmount')}</span>
                <div className="stat-icon-wrapper" style={{ background: 'var(--accent-red-bg)', color: 'var(--accent-red)' }}>
                  <AlertTriangle size={22} />
                </div>
              </div>
              <div className="stat-value" style={{ color: 'var(--accent-red)' }}>
                {formatCurrency(totalOverdue, company.currency)}
              </div>
              <span className="text-xs" style={{ color: 'var(--accent-red)', fontWeight: 600 }}>
                Shoshilinch eslatma talab etiladi
              </span>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between">
                <span className="stat-label">{t('dashboard.expectedNext30Days')}</span>
                <div className="stat-icon-wrapper" style={{ background: 'var(--accent-green-bg)', color: 'var(--accent-green)' }}>
                  <TrendingUp size={22} />
                </div>
              </div>
              <div className="stat-value" style={{ color: 'var(--accent-green)' }}>
                {formatCurrency(forecast.totalExpectedNext30Days, company.currency)}
              </div>
              <span className="text-xs" style={{ color: 'var(--accent-green)' }}>
                {forecast.confidenceScore}% bashorat ishonchliligi
              </span>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between">
                <span className="stat-label">{t('dashboard.avgDso')}</span>
                <div className="stat-icon-wrapper" style={{ background: 'var(--bg-muted)', color: 'var(--text-secondary)' }}>
                  <Clock size={22} />
                </div>
              </div>
              <div className="stat-value">
                {avgDso} <span style={{ fontSize: '1rem', fontWeight: 500 }}>{t('dashboard.days')}</span>
              </div>
              <span className="text-xs text-muted">Standart to'lov intizomi bo'yicha</span>
            </div>
          </div>

          {/* 30-Day Cash Flow Projection Chart Widget */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">{t('dashboard.chartTitle')}</h3>
                <p className="card-subtitle">{t('dashboard.chartSubtitle')}</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1">
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--accent-green)' }} />
                  <span>Kutilayotgan tushum</span>
                </div>
                <div className="flex items-center gap-1">
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--accent-red)' }} />
                  <span>Muddati o'tgan qarzlar</span>
                </div>
              </div>
            </div>

            {/* Visual Bar Pillars */}
            <div className="chart-bars-container">
              {forecast.dailyForecast.map((day, i) => {
                const maxAmount = 90000000; // scaling base
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
                    {/* Show label every 3 days */}
                    {i % 3 === 0 && <span className="chart-bar-label">{day.dayLabel}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Two Columns: Recent Invoices & Top Late Payers */}
          <div className="grid grid-cols-3 gap-6">
            {/* Recent Invoices Table (2 cols) */}
            <div className="card" style={{ gridColumn: 'span 2' }}>
              <div className="card-header">
                <div>
                  <h3 className="card-title">{t('dashboard.recentInvoices')}</h3>
                  <p className="card-subtitle">So'nggi chiqarilgan hisob-fakturalar holati</p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('invoices.invoiceNumber')}</th>
                      <th>{t('invoices.client')}</th>
                      <th>{t('invoices.dueDate')}</th>
                      <th style={{ textAlign: 'right' }}>{t('invoices.total')}</th>
                      <th style={{ textAlign: 'center' }}>{t('invoices.status')}</th>
                      <th style={{ textAlign: 'right' }}>{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.slice(0, 6).map((inv) => {
                      const client = clientsMap[inv.client_id];
                      const statusInfo = getInvoiceStatusLabel(inv.status, locale);
                      return (
                        <tr key={inv.id}>
                          <td className="font-semibold">{inv.invoice_number}</td>
                          <td>
                            <div>
                              <p className="text-sm font-semibold">{client?.name || 'Mijoz'}</p>
                              {client && <p className="text-xs text-muted">Skor: {client.reliability_score}/100</p>}
                            </div>
                          </td>
                          <td className="text-xs">{formatDate(inv.due_date, locale)}</td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>
                            {formatCurrency(Number(inv.total_amount), inv.currency)}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className={`badge ${statusInfo.className}`}>{statusInfo.text}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setSelectedInvoice(inv)}
                                type="button"
                                className="btn btn-ghost btn-sm"
                                title="Ko'rish va PDF"
                              >
                                <Eye size={15} />
                              </button>
                              {inv.status !== 'paid' && (
                                <button
                                  onClick={() => handleQuickReminder(inv.id)}
                                  type="button"
                                  className="btn btn-ghost btn-sm"
                                  style={{ color: 'var(--accent-blue)' }}
                                  title="Telegram eslatma yuborish"
                                >
                                  <Send size={15} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Late Payers (1 col) */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">{t('dashboard.topLatePayers')}</h3>
                  <p className="card-subtitle">Kechikish xavfi yuqori kontragentlar</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {topLatePayers.map((client) => {
                  const relTier = getReliabilityTier(client.reliability_score);
                  return (
                    <div
                      key={client.id}
                      style={{
                        padding: '12px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-subtle)',
                      }}
                    >
                      <div className="flex justify-between items-start" style={{ marginBottom: '6px' }}>
                        <span className="font-semibold text-sm">{client.name}</span>
                        <span className={`badge ${relTier.badgeClass}`} style={{ fontSize: '0.7rem' }}>
                          {client.reliability_score} ball
                        </span>
                      </div>
                      <p className="text-xs text-muted">
                        O'rtacha kechikish: <strong>{client.avg_delay_days} kun</strong>
                      </p>
                      {client.telegram && (
                        <p className="text-xs text-muted" style={{ marginTop: '2px' }}>
                          Telegram: {client.telegram}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <InvoiceCreateModal
        isOpen={createInvoiceOpen}
        onClose={() => setCreateInvoiceOpen(false)}
      />

      <InvoiceDetailModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onRecordPayment={(inv) => {
          setSelectedInvoice(null);
          setPaymentInvoice(inv);
        }}
      />

      <RecordPaymentModal
        invoice={paymentInvoice}
        isOpen={!!paymentInvoice}
        onClose={() => setPaymentInvoice(null)}
      />
    </div>
  );
}
