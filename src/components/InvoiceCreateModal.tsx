'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/utils';
import { X, Plus, Trash2, FileText, CheckCircle2 } from 'lucide-react';
import { InvoiceItem } from '@/types/database';

interface InvoiceCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClientId?: string;
}

export function InvoiceCreateModal({ isOpen, onClose, defaultClientId }: InvoiceCreateModalProps) {
  const { t, clients, addInvoice, company } = useApp();

  const [clientId, setClientId] = useState(defaultClientId || (clients[0]?.id || ''));
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-2026-00${Math.floor(Math.random() * 90) + 10}`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Default due date: +14 days
  const defaultDue = new Date();
  defaultDue.setDate(defaultDue.getDate() + 14);
  const [dueDate, setDueDate] = useState(defaultDue.toISOString().split('T')[0]);

  const [currency, setCurrency] = useState<'UZS' | 'USD' | 'EUR' | 'RUB'>('UZS');
  const [taxRate, setTaxRate] = useState<number>(12); // QQS 12%
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const [items, setItems] = useState<Array<{ description: string; quantity: number; unit_price: number }>>([
    { description: 'Transport va yetkazib berish xizmati', quantity: 1, unit_price: 15000000 },
  ]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0), 0);
  const taxAmount = (subtotal * (Number(taxRate) || 0)) / 100;
  const totalAmount = Math.max(0, subtotal + taxAmount - (Number(discountAmount) || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || items.length === 0 || subtotal <= 0) return;

    const formattedItems: InvoiceItem[] = items.map((it, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      invoice_id: '',
      description: it.description || 'Xizmat',
      quantity: Number(it.quantity) || 1,
      unit_price: Number(it.unit_price) || 0,
      tax_rate: taxRate,
      amount: (Number(it.quantity) || 1) * (Number(it.unit_price) || 0),
    }));

    addInvoice({
      company_id: company.id,
      client_id: clientId,
      invoice_number: invoiceNumber,
      issue_date: issueDate,
      due_date: dueDate,
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      currency,
      notes,
      items: formattedItems,
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-secondary" />
            <h3 style={{ fontSize: '1.15rem' }}>{t('invoices.createInvoice')}</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top row: Client & Invoice number */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('invoices.client')} *</label>
                <select
                  required
                  className="form-select"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                >
                  <option value="" disabled>Mijozni tanlang</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.tax_id ? `(STIR: ${c.tax_id})` : ''} — Skor: {c.reliability_score}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('invoices.invoiceNumber')} *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>
            </div>

            {/* Dates & Currency */}
            <div className="grid grid-cols-3 gap-4">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('invoices.issueDate')}</label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('invoices.dueDate')} *</label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Valyuta</label>
                <select
                  className="form-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                >
                  <option value="UZS">UZS (So'm)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="RUB">RUB (₽)</option>
                </select>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Xizmat va tovar pozitsiyalari</h4>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="btn btn-outline btn-sm"
                  style={{ gap: '4px' }}
                >
                  <Plus size={14} />
                  <span>{t('invoices.addItem')}</span>
                </button>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '45%' }}>{t('invoices.description')}</th>
                      <th style={{ width: '15%' }}>{t('invoices.qty')}</th>
                      <th style={{ width: '25%' }}>{t('invoices.price')}</th>
                      <th style={{ width: '15%', textAlign: 'right' }}>{t('invoices.amount')}</th>
                      <th style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, idx) => {
                      const lineTotal = (Number(it.quantity) || 0) * (Number(it.unit_price) || 0);
                      return (
                        <tr key={idx}>
                          <td>
                            <input
                              type="text"
                              required
                              placeholder="Xizmat nomi"
                              className="form-input"
                              style={{ padding: '6px 10px', fontSize: '0.875rem' }}
                              value={it.description}
                              onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              required
                              className="form-input"
                              style={{ padding: '6px 10px', fontSize: '0.875rem' }}
                              value={it.quantity}
                              onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              step="1000"
                              required
                              className="form-input"
                              style={{ padding: '6px 10px', fontSize: '0.875rem' }}
                              value={it.unit_price}
                              onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                            />
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>
                            {formatCurrency(lineTotal, currency)}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(idx)}
                                className="btn btn-ghost btn-sm"
                                style={{ padding: '4px', color: 'var(--accent-red)' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations & Notes */}
            <div className="grid grid-cols-2 gap-6" style={{ marginTop: '10px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('invoices.notes')}</label>
                <textarea
                  rows={3}
                  placeholder="To'lov topshirig'i yoki shartnoma raqami haqida qo'shimcha ma'lumot..."
                  className="form-textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div
                style={{
                  background: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div className="flex justify-between text-sm">
                  <span className="text-muted">{t('invoices.subtotal')}:</span>
                  <span className="font-semibold">{formatCurrency(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">{t('invoices.tax')} (QQS %):</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      className="form-input"
                      style={{ width: '60px', padding: '2px 6px', fontSize: '0.8125rem' }}
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                    />
                    <span className="font-semibold">{formatCurrency(taxAmount, currency)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">{t('invoices.discount')}:</span>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    style={{ width: '110px', padding: '2px 6px', fontSize: '0.8125rem' }}
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  />
                </div>
                <div
                  style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '8px',
                    marginTop: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span className="font-bold">{t('invoices.grandTotal')}:</span>
                  <span className="font-bold" style={{ fontSize: '1.2rem', color: 'var(--accent-green)' }}>
                    {formatCurrency(totalAmount, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} />
              <span>Fakturani yaratish va saqlash</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
