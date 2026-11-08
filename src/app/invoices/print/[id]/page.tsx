'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate, getInvoiceStatusLabel } from '@/lib/utils';
import { Printer, ArrowLeft, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function InvoicePrintPage() {
  const params = useParams();
  const router = useRouter();
  const { invoices, clients, company, locale } = useApp();

  const invoiceId = params?.id as string;
  const invoice = invoices.find((inv) => inv.id === invoiceId) || invoices[0];
  const client = clients.find((c) => c.id === invoice?.client_id) || invoice?.client;
  const statusInfo = invoice ? getInvoiceStatusLabel(invoice.status, locale) : { text: '', className: '' };

  useEffect(() => {
    // Optionally auto-trigger print dialog after render
    const timer = setTimeout(() => {
      // User can click button or auto-print
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!invoice) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Hisob-faktura topilmadi</h2>
        <Link href="/invoices" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Fakturalar ro'yxatiga qaytish
        </Link>
      </div>
    );
  }

  const subtotal = Number(invoice.subtotal) || 0;
  const taxAmount = Number(invoice.tax_amount) || 0;
  const discountAmount = Number(invoice.discount_amount) || 0;
  const totalAmount = Number(invoice.total_amount) || 0;
  const paidAmount = Number(invoice.paid_amount) || 0;
  const remainingAmount = Math.max(0, totalAmount - paidAmount);

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '24px 16px' }}>
      {/* Top Floating Action Bar (Hidden during Print) */}
      <div
        className="no-print"
        style={{
          maxWidth: '850px',
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card)',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <button
          onClick={() => router.back()}
          className="btn btn-outline btn-sm"
          style={{ gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>Ortga qaytish</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted">
            PDF yaratish uchun <strong>"Chop etish"</strong> tugmasini bosing va <strong>"Save as PDF"</strong>ni tanlang.
          </span>
          <button
            onClick={() => window.print()}
            className="btn btn-primary btn-sm"
            style={{ gap: '6px' }}
          >
            <Printer size={16} />
            <span>PDF sifatida saqlash / Chop etish</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet (A4 size styled) */}
      <div
        id="printable-invoice"
        style={{
          maxWidth: '850px',
          margin: '0 auto',
          background: '#ffffff',
          color: '#0f172a',
          padding: '48px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-md)',
          fontSize: '10pt',
          lineHeight: '1.4',
        }}
      >
        {/* Document Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid #0f2b46',
            paddingBottom: '24px',
            marginBottom: '28px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: '#0f2b46',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f2b46', margin: 0 }}>
                {company.name}
              </h1>
            </div>
            <p style={{ margin: '2px 0', fontSize: '8.5pt', color: '#475569' }}>
              <strong>STIR (INN):</strong> {company.tax_id}
            </p>
            <p style={{ margin: '2px 0', fontSize: '8.5pt', color: '#475569' }}>
              <strong>Manzil:</strong> {company.address}
            </p>
            <p style={{ margin: '2px 0', fontSize: '8.5pt', color: '#475569' }}>
              <strong>Tel:</strong> {company.phone} • <strong>Email:</strong> {company.email}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#0f2b46',
                letterSpacing: '0.05em',
                margin: 0,
              }}
            >
              HISOB-FAKTURA
            </h2>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563eb', margin: '4px 0' }}>
              № {invoice.invoice_number}
            </p>
            <p style={{ margin: '2px 0', fontSize: '8.5pt', color: '#475569' }}>
              <strong>Berilgan sana:</strong> {formatDate(invoice.issue_date, locale)}
            </p>
            <p style={{ margin: '2px 0', fontSize: '8.5pt', color: '#ef4444', fontWeight: 600 }}>
              <strong>To'lov muddati:</strong> {formatDate(invoice.due_date, locale)}
            </p>
            <div style={{ marginTop: '6px' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  fontSize: '8pt',
                  fontWeight: 700,
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                }}
              >
                HOLAT: {statusInfo.text.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Counterparty / Client Block */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '16px',
            marginBottom: '28px',
          }}
        >
          <div>
            <p style={{ fontSize: '7.5pt', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, margin: '0 0 4px' }}>
              Buyurtmachi (Xaridor):
            </p>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
              {client?.name || 'Mijoz'}
            </h3>
            {client?.tax_id && (
              <p style={{ fontSize: '8.5pt', color: '#475569', margin: '2px 0' }}>
                <strong>STIR / INN:</strong> {client.tax_id}
              </p>
            )}
            {client?.address && (
              <p style={{ fontSize: '8.5pt', color: '#475569', margin: '2px 0' }}>
                <strong>Yuridik manzil:</strong> {client.address}
              </p>
            )}
          </div>

          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '7.5pt', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, margin: '0 0 4px' }}>
              Mas'ul shaxs va aloqa:
            </p>
            <p style={{ fontSize: '9pt', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>
              {client?.contact_person || '—'}
            </p>
            {client?.phone && (
              <p style={{ fontSize: '8.5pt', color: '#475569', margin: '2px 0' }}>
                Tel: {client.phone}
              </p>
            )}
            {client?.email && (
              <p style={{ fontSize: '8.5pt', color: '#475569', margin: '2px 0' }}>
                Email: {client.email}
              </p>
            )}
            {client?.telegram && (
              <p style={{ fontSize: '8.5pt', color: '#2563eb', margin: '2px 0' }}>
                Telegram: {client.telegram}
              </p>
            )}
          </div>
        </div>

        {/* Table of Items */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '24px',
            fontSize: '9pt',
          }}
        >
          <thead>
            <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', width: '6%', fontWeight: 700 }}>№</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', width: '48%', fontWeight: 700 }}>Tovarlar (xizmatlar) nomi</th>
              <th style={{ padding: '10px 12px', textAlign: 'center', width: '12%', fontWeight: 700 }}>Miqdori</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', width: '16%', fontWeight: 700 }}>Narxi ({invoice.currency})</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', width: '18%', fontWeight: 700 }}>Summasi ({invoice.currency})</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.items && invoice.items.length > 0
              ? invoice.items
              : [
                  {
                    id: 'it-1',
                    description: invoice.notes || "Transport va yetkazib berish xizmati",
                    quantity: 1,
                    unit_price: subtotal,
                    amount: subtotal,
                    tax_rate: 12,
                  },
                ]
            ).map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px 12px', color: '#64748b' }}>{idx + 1}</td>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.description}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                  {formatCurrency(Number(item.unit_price), invoice.currency)}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>
                  {formatCurrency(Number(item.amount), invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Calculation Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
          <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '9pt' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Oraliq jami (Subtotal):</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(subtotal, invoice.currency)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>QQS (12%):</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(taxAmount, invoice.currency)}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
                <span>Chegirma:</span>
                <span>-{formatCurrency(discountAmount, invoice.currency)}</span>
              </div>
            )}
            <div
              style={{
                borderTop: '2px solid #0f2b46',
                paddingTop: '8px',
                marginTop: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11pt',
                fontWeight: 800,
                color: '#0f2b46',
              }}
            >
              <span>JAMI TO'LANISHI KERAK:</span>
              <span style={{ color: '#059669' }}>{formatCurrency(totalAmount, invoice.currency)}</span>
            </div>
            {paidAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontSize: '8.5pt' }}>
                <span>To'langan summa:</span>
                <span>{formatCurrency(paidAmount, invoice.currency)}</span>
              </div>
            )}
            {remainingAmount > 0 && invoice.status !== 'paid' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', fontWeight: 700, fontSize: '9pt' }}>
                <span>Qolgan qarzdorlik:</span>
                <span>{formatCurrency(remainingAmount, invoice.currency)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bank Payment Requisites */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '14px 18px',
            marginBottom: '28px',
            fontSize: '8.5pt',
          }}
        >
          <p style={{ fontWeight: 700, margin: '0 0 6px', color: '#0f2b46' }}>
            To'lov uchun bank rekvizitlari:
          </p>
          <p style={{ margin: '2px 0' }}><strong>Hisob raqam (H/r):</strong> 20208000900123456001</p>
          <p style={{ margin: '2px 0' }}><strong>Bank:</strong> ATIB "Ipoteka-bank" Bosh amaliyot boshqarmasi</p>
          <p style={{ margin: '2px 0' }}><strong>MFO:</strong> 00450 • <strong>STIR:</strong> {company.tax_id}</p>
          <p style={{ margin: '4px 0 0', color: '#64748b' }}>
            To'lov maqsadida albatta: <em>"{invoice.invoice_number} hisob-faktura bo'yicha to'lov"</em> deb ko'rsatilsin.
          </p>
        </div>

        {/* Signatures & Stamps */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            paddingTop: '20px',
            borderTop: '1px solid #e2e8f0',
            fontSize: '8.5pt',
          }}
        >
          <div>
            <p style={{ fontWeight: 700, marginBottom: '40px' }}>Yetkazib beruvchi (Ijrochi):</p>
            <div style={{ borderBottom: '1px solid #64748b', width: '220px', marginBottom: '6px' }} />
            <p style={{ color: '#475569' }}>Rahbar: Qodirov A. (Imzo / M.O'.)</p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 700, marginBottom: '40px' }}>Qabul qilib oluvchi (Buyurtmachi):</p>
            <div style={{ borderBottom: '1px solid #64748b', width: '220px', marginLeft: 'auto', marginBottom: '6px' }} />
            <p style={{ color: '#475569' }}>Mas'ul shaxs (Imzo / M.O'.)</p>
          </div>
        </div>

        {/* Watermark / Digital verification */}
        <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '7.5pt', color: '#94a3b8' }}>
          Hujjat CashBridge B2B SaaS tizimi orqali elektron shaklda shakllantirildi va tasdiqlandi. www.cashbridge.uz
        </div>
      </div>
    </div>
  );
}
