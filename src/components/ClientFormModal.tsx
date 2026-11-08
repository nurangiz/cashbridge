'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Building, User, Mail, Phone, Send, FileText } from 'lucide-react';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClientFormModal({ isOpen, onClose }: ClientFormModalProps) {
  const { t, addClient } = useApp();
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [taxId, setTaxId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addClient({
      company_id: 'c0000000-0000-0000-0000-000000000001',
      name,
      contact_person: contactPerson,
      tax_id: taxId,
      email,
      phone,
      telegram,
      address,
      status: 'active',
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Building size={20} className="text-secondary" />
            <h3 style={{ fontSize: '1.15rem' }}>{t('clients.newClient')}</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">{t('clients.clientName')} *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Orient Trade QK"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">{t('clients.taxId')} (INN)</label>
                <input
                  type="text"
                  placeholder="301234567"
                  className="form-input"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('clients.contactPerson')}</label>
                <input
                  type="text"
                  placeholder="Aziz Karimov"
                  className="form-input"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">{t('clients.phone')}</label>
                <input
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('clients.telegram')}</label>
                <input
                  type="text"
                  placeholder="@aziz_karimov"
                  className="form-input"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('clients.email')}</label>
              <input
                type="email"
                placeholder="finance@orient.uz"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Yuridik manzil</label>
              <input
                type="text"
                placeholder="Toshkent sh., Yunusobod t., Amir Temur 108"
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn-primary">
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
