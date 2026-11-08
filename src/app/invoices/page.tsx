'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate, getInvoiceStatusLabel } from '@/lib/utils';
import { InvoiceCreateModal } from '@/components/InvoiceCreateModal';
import { InvoiceDetailModal } from '@/components/InvoiceDetailModal';
import { RecordPaymentModal } from '@/components/RecordPaymentModal';
import { Invoice, InvoiceStatus } from '@/types/database';
import { Plus, Eye, Send, CheckCircle, Search, FileText } from 'lucide-react';

export default function InvoicesPage() {
  const { t, locale, invoices, clients, sendReminder } = useApp();

  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const clientsMap = React.useMemo(() => {
    const map: Record<string, any> = {};
    clients.forEach((c) => (map[c.id] = c));
    return map;
  }, [clients]);

  const filteredInvoices = invoices.filter((inv) => {
    const client = clientsMap[inv.client_id];
    const matchesTab = activeTab === 'all' || inv.status === activeTab;
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client && client.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

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
          title={t('invoices.title')}
          subtitle={t('invoices.subtitle')}
          action={
            <button onClick={() => setCreateInvoiceOpen(true)} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>{t('invoices.createInvoice')}</span>
            </button>
          }
        />

        <main className="app-content">
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

          {/* Controls: Search and Tabs */}
          <div
            className="card"
            style={{
              padding: '16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Faktura raqami yoki mijoz nomi..."
                className="form-input"
                style={{ paddingLeft: '36px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1" style={{ background: 'var(--bg-muted)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
              {[
                { id: 'all', label: 'Barchasi' },
                { id: 'sent', label: 'Yuborilgan' },
                { id: 'overdue', label: "Muddati o'tgan" },
                { id: 'paid', label: "To'langan" },
                { id: 'draft', label: 'Qoralama' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="btn btn-sm"
                  style={{
                    background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                    boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
                    fontWeight: 600,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Invoices Table */}
          <div className="card" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('invoices.invoiceNumber')}</th>
                    <th>{t('invoices.client')}</th>
                    <th>{t('invoices.issueDate')}</th>
                    <th>{t('invoices.dueDate')}</th>
                    <th style={{ textAlign: 'right' }}>{t('invoices.total')}</th>
                    <th style={{ textAlign: 'right' }}>{t('invoices.paid')}</th>
                    <th style={{ textAlign: 'center' }}>{t('invoices.status')}</th>
                    <th style={{ textAlign: 'right' }}>{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv) => {
                    const client = clientsMap[inv.client_id];
                    const statusInfo = getInvoiceStatusLabel(inv.status, locale);
                    return (
                      <tr key={inv.id}>
                        <td>
                          <button
                            type="button"
                            onClick={() => setSelectedInvoice(inv)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--accent-blue)',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <FileText size={15} />
                            <span>{inv.invoice_number}</span>
                          </button>
                        </td>
                        <td>
                          <span className="font-semibold text-sm">{client?.name || 'Mijoz'}</span>
                        </td>
                        <td className="text-xs text-muted">{formatDate(inv.issue_date, locale)}</td>
                        <td className="text-xs font-semibold" style={{ color: inv.status === 'overdue' ? 'var(--accent-red)' : 'inherit' }}>
                          {formatDate(inv.due_date, locale)}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>
                          {formatCurrency(Number(inv.total_amount), inv.currency)}
                        </td>
                        <td style={{ textAlign: 'right', color: 'var(--accent-green)', fontWeight: 600 }}>
                          {Number(inv.paid_amount) > 0 ? formatCurrency(Number(inv.paid_amount), inv.currency) : '—'}
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
                              title="PDF ko'rish va chop etish"
                            >
                              <Eye size={15} />
                            </button>
                            {inv.status !== 'paid' && (
                              <>
                                <button
                                  onClick={() => handleQuickReminder(inv.id)}
                                  type="button"
                                  className="btn btn-ghost btn-sm"
                                  style={{ color: 'var(--accent-blue)' }}
                                  title="Telegram eslatma yuborish"
                                >
                                  <Send size={15} />
                                </button>
                                <button
                                  onClick={() => setPaymentInvoice(inv)}
                                  type="button"
                                  className="btn btn-accent btn-sm"
                                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                >
                                  To'lash
                                </button>
                              </>
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
        </main>
      </div>

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
