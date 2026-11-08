'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useApp } from '@/context/AppContext';
import { ClientFormModal } from '@/components/ClientFormModal';
import { InvoiceCreateModal } from '@/components/InvoiceCreateModal';
import { getReliabilityTier, formatCurrency } from '@/lib/utils';
import { Plus, Users, Search, Building2, Phone, Mail, Send, Award, FilePlus } from 'lucide-react';

export default function ClientsPage() {
  const { t, locale, clients, company } = useApp();
  const [createClientOpen, setCreateClientOpen] = useState(false);
  const [invoiceModalClientId, setInvoiceModalClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.tax_id && c.tax_id.includes(searchQuery)) ||
      (c.contact_person && c.contact_person.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-main">
        <Header
          title={t('clients.title')}
          subtitle={t('clients.subtitle')}
          action={
            <button onClick={() => setCreateClientOpen(true)} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>{t('clients.newClient')}</span>
            </button>
          }
        />

        <main className="app-content">
          {/* Search bar */}
          <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
            <div style={{ position: 'relative', maxWidth: '420px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Mijoz nomi, STIR (INN) yoki mas'ul shaxs..."
                className="form-input"
                style={{ paddingLeft: '36px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Clients Data Table */}
          <div className="card" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('clients.clientName')}</th>
                    <th>{t('clients.contactPerson')}</th>
                    <th>Aloqa kanallari</th>
                    <th style={{ textAlign: 'center' }}>{t('clients.reliabilityScore')}</th>
                    <th style={{ textAlign: 'center' }}>{t('clients.avgDelay')}</th>
                    <th style={{ textAlign: 'right' }}>Qarzdorlik</th>
                    <th style={{ textAlign: 'right' }}>{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => {
                    const tier = getReliabilityTier(client.reliability_score);
                    return (
                      <tr key={client.id}>
                        <td>
                          <div>
                            <p className="font-semibold text-sm">{client.name}</p>
                            {client.tax_id && <p className="text-xs text-muted">STIR: {client.tax_id}</p>}
                          </div>
                        </td>
                        <td>
                          <p className="text-sm">{client.contact_person || '—'}</p>
                        </td>
                        <td>
                          <div className="flex flex-col gap-1 text-xs text-muted">
                            {client.phone && (
                              <div className="flex items-center gap-1">
                                <Phone size={12} />
                                <span>{client.phone}</span>
                              </div>
                            )}
                            {client.telegram && (
                              <div className="flex items-center gap-1" style={{ color: 'var(--accent-blue)' }}>
                                <Send size={12} />
                                <span>{client.telegram}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${tier.badgeClass}`}>
                            {client.reliability_score} / 100
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="font-semibold text-sm">
                            {client.avg_delay_days > 0 ? `${client.avg_delay_days} kun` : "O'z vaqtida"}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>
                          {client.total_overdue && client.total_overdue > 0 ? (
                            <span style={{ color: 'var(--accent-red)' }}>
                              {formatCurrency(client.total_overdue, company.currency)}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--accent-green)' }}>Qarz yo'q</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => setInvoiceModalClientId(client.id)}
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ gap: '4px' }}
                            title="Ushbu mijozga yangi faktura chiqarish"
                          >
                            <FilePlus size={14} />
                            <span>Faktura</span>
                          </button>
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

      <ClientFormModal
        isOpen={createClientOpen}
        onClose={() => setCreateClientOpen(false)}
      />

      <InvoiceCreateModal
        isOpen={!!invoiceModalClientId}
        defaultClientId={invoiceModalClientId || undefined}
        onClose={() => setInvoiceModalClientId(null)}
      />
    </div>
  );
}
