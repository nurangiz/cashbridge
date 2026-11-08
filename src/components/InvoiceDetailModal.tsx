'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Invoice } from '@/types/database';
import { formatCurrency, formatDate, getInvoiceStatusLabel } from '@/lib/utils';
import {
  X,
  Printer,
  Mail,
  Send,
  CheckCircle,
  FileText,
  Building2,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onRecordPayment: (invoice: Invoice) => void;
}

export function InvoiceDetailModal({ invoice, onClose, onRecordPayment }: InvoiceDetailModalProps) {
  const { t, locale, company, clients, sendReminder, markInvoiceAsPaid } = useApp();
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [sending, setSending] = useState(false);

  if (!invoice) return null;

  const client = clients.find((c) => c.id === invoice.client_id) || invoice.client;
  const statusInfo = getInvoiceStatusLabel(invoice.status, locale);
  const remainingAmount = Math.max(0, Number(invoice.total_amount) - Number(invoice.paid_amount || 0));

  const handleSendEmail = async () => {
    setSending(true);
    setFeedbackMsg(null);
    const res = await sendReminder(invoice.id, 'email');
    setSending(false);
    setFeedbackMsg({ type: res.success ? 'success' : 'error', text: res.message });
  };

  const handleSendTelegram = async () => {
    setSending(true);
    setFeedbackMsg(null);
    const res = await sendReminder(invoice.id, 'telegram');
    setSending(false);
    setFeedbackMsg({ type: res.success ? 'success' : 'error', text: res.message });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '820px', background: 'var(--bg-card)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Actions */}
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-secondary" />
            <h3 style={{ fontSize: '1.15rem' }}>{invoice.invoice_number}</h3>
            <span className={`badge ${statusInfo.className}`}>{statusInfo.text}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="btn btn-outline btn-sm"
              title="Chop etish yoki PDF sifatida saqlash"
            >
              <Printer size={15} />
              <span>Chop etish (PDF)</span>
            </button>
            <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div
            style={{
              padding: '10px 24px',
              backgroundColor: feedbackMsg.type === 'success' ? 'var(--accent-green-bg)' : 'var(--accent-red-bg)',
              color: feedbackMsg.type === 'success' ? 'var(--accent-green-text)' : 'var(--accent-red-text)',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {feedbackMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Printable Invoice Container */}
        <div className="modal-body" id="printable-invoice" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Company & Invoice Meta */}
          <div className="flex justify-between items-start" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {company.name}
              </h2>
              <p className="text-xs text-muted">STIR (INN): {company.tax_id}</p>
              <p className="text-xs text-muted">{company.address}</p>
              <p className="text-xs text-muted">{company.phone} • {company.email}</p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
                HISOB-FAKTURA
              </h3>
              <p className="font-bold text-sm" style={{ marginTop: '4px' }}>{invoice.invoice_number}</p>
              <p className="text-xs text-muted">Berilgan: {formatDate(invoice.issue_date, locale)}</p>
              <p className="text-xs font-semibold" style={{ color: invoice.status === 'overdue' ? 'var(--accent-red)' : 'var(--text-secondary)' }}>
                Muddat: {formatDate(invoice.due_date, locale)}
              </p>
            </div>
          </div>

          {/* Client Recipient Info */}
          <div
            style={{
              background: 'var(--bg-muted)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p className="text-xs text-muted" style={{ textTransform: 'uppercase', fontWeight: 600 }}>Xaridor (Kontragent):</p>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '2px' }}>{client?.name || 'Mijoz'}</h4>
              {client?.tax_id && <p className="text-xs text-muted">STIR: {client.tax_id}</p>}
              {client?.address && <p className="text-xs text-muted">{client.address}</p>}
            </div>

            <div style={{ textAlign: 'right' }}>
              <p className="text-xs text-muted" style={{ textTransform: 'uppercase', fontWeight: 600 }}>Mas'ul shaxs:</p>
              <p className="text-sm font-semibold">{client?.contact_person || '—'}</p>
              <p className="text-xs text-muted">{client?.phone} • {client?.email}</p>
              {client?.telegram && <p className="text-xs text-muted">Telegram: {client.telegram}</p>}
            </div>
          </div>

          {/* Items Table */}
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '50%' }}>Tavsif / Xizmat</th>
                  <th style={{ width: '15%', textAlign: 'center' }}>Miqdor</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>Narxi</th>
                  <th style={{ width: '20%', textAlign: 'right' }}>Summa</th>
                </tr>
              </thead>
              <tbody>
                {(invoice.items && invoice.items.length > 0
                  ? invoice.items
                  : [
                      {
                        id: 'def-1',
                        description: invoice.notes || "Asosiy xizmatlar to'plami",
                        quantity: 1,
                        unit_price: Number(invoice.subtotal),
                        amount: Number(invoice.subtotal),
                        tax_rate: 12,
                      },
                    ]
                ).map((item, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold">{item.description}</td>
                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(Number(item.unit_price), invoice.currency)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>
                      {formatCurrency(Number(item.amount), invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex justify-end">
            <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Oraliq summa:</span>
                <span>{formatCurrency(Number(invoice.subtotal), invoice.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">QQS (12%):</span>
                <span>{formatCurrency(Number(invoice.tax_amount), invoice.currency)}</span>
              </div>
              {Number(invoice.discount_amount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Chegirma:</span>
                  <span>-{formatCurrency(Number(invoice.discount_amount), invoice.currency)}</span>
                </div>
              )}
              <div
                style={{
                  borderTop: '2px solid var(--border)',
                  paddingTop: '8px',
                  marginTop: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span className="font-bold">Jami:</span>
                <span className="font-bold" style={{ fontSize: '1.15rem', color: 'var(--accent-green)' }}>
                  {formatCurrency(Number(invoice.total_amount), invoice.currency)}
                </span>
              </div>
              {Number(invoice.paid_amount) > 0 && (
                <div className="flex justify-between text-xs" style={{ color: 'var(--accent-green)' }}>
                  <span>To'langan:</span>
                  <span>{formatCurrency(Number(invoice.paid_amount), invoice.currency)}</span>
                </div>
              )}
              {remainingAmount > 0 && invoice.status !== 'paid' && (
                <div className="flex justify-between text-xs font-bold" style={{ color: 'var(--accent-red)' }}>
                  <span>Qolgan qarz:</span>
                  <span>{formatCurrency(remainingAmount, invoice.currency)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <p className="text-xs text-muted font-semibold">Izoh:</p>
              <p className="text-xs text-secondary">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Modal Footer with Dispatch and Payment Controls */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSendEmail}
              disabled={sending}
              type="button"
              className="btn btn-secondary btn-sm"
              title="Resend orqali mijoz pochtasiga yuborish"
            >
              <Mail size={15} />
              <span>Email jo'natish</span>
            </button>

            <button
              onClick={handleSendTelegram}
              disabled={sending}
              type="button"
              className="btn btn-secondary btn-sm"
              title="Telegram bot orqali mijozga eslatma yuborish"
            >
              <Send size={15} />
              <span>Telegram jo'natish</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {invoice.status !== 'paid' && (
              <button
                onClick={() => onRecordPayment(invoice)}
                type="button"
                className="btn btn-accent btn-sm"
              >
                <CheckCircle size={15} />
                <span>To'lovni qabul qilish</span>
              </button>
            )}
            <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
              Yopish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
