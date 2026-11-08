'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Invoice } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { X, CheckCircle, CreditCard } from 'lucide-react';

interface RecordPaymentModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RecordPaymentModal({ invoice, isOpen, onClose }: RecordPaymentModalProps) {
  const { t, markInvoiceAsPaid } = useApp();
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<'bank_transfer' | 'payme' | 'click' | 'cash'>('bank_transfer');
  const [refCode, setRefCode] = useState('');

  React.useEffect(() => {
    if (invoice) {
      const remaining = Math.max(0, Number(invoice.total_amount) - Number(invoice.paid_amount || 0));
      setAmount(remaining);
      setRefCode(`TR-${Math.floor(Math.random() * 90000) + 10000}`);
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    markInvoiceAsPaid(invoice.id, Number(invoice.paid_amount || 0) + Number(amount));
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <CreditCard size={20} className="text-secondary" />
            <h3 style={{ fontSize: '1.15rem' }}>To'lovni qayd etish</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ marginBottom: '16px' }}>
              <p className="text-xs text-muted">Faktura raqami:</p>
              <p className="font-bold text-sm">{invoice.invoice_number}</p>
              <p className="text-xs text-muted" style={{ marginTop: '4px' }}>
                Jami: {formatCurrency(Number(invoice.total_amount), invoice.currency)} • 
                Qoldiq: {formatCurrency(Math.max(0, Number(invoice.total_amount) - Number(invoice.paid_amount || 0)), invoice.currency)}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">To'langan summa ({invoice.currency}) *</label>
              <input
                type="number"
                required
                min="100"
                step="100"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">To'lov usuli</label>
              <select
                className="form-select"
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
              >
                <option value="bank_transfer">Bank o'tkazmasi (Hisob raqam)</option>
                <option value="payme">Payme Business</option>
                <option value="click">Click Business</option>
                <option value="cash">Naqd pul / Kassa</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">To'lov hujjati / Tranzaksiya raqami</label>
              <input
                type="text"
                placeholder="TR-84920"
                className="form-input"
                value={refCode}
                onChange={(e) => setRefCode(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn-accent">
              <CheckCircle size={16} />
              <span>To'lovni tasdiqlash</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
