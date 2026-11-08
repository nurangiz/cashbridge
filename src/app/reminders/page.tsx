'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/lib/utils';
import { BellRing, Check, Save, Send, AlertCircle, History, MessageSquareCode } from 'lucide-react';

export default function RemindersPage() {
  const { t, locale, reminderRules, updateReminderRule, reminderLogs, sendReminder, invoices } = useApp();

  const [activeTab, setActiveTab] = useState<'rules' | 'templates' | 'logs'>('rules');
  const [selectedRuleId, setSelectedRuleId] = useState<string>(reminderRules[0]?.id || '');
  const [templateLang, setTemplateLang] = useState<'uz' | 'ru' | 'en'>('uz');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const selectedRule = reminderRules.find((r) => r.id === selectedRuleId) || reminderRules[0];

  const handleToggleRule = (id: string, current: boolean) => {
    updateReminderRule(id, { is_active: !current });
  };

  const handleChannelChange = (id: string, channel: 'email' | 'telegram' | 'both') => {
    updateReminderRule(id, { channel });
  };

  const handleTestDispatch = async () => {
    const overdueOrSent = invoices.find((i) => i.status === 'overdue' || i.status === 'sent');
    if (!overdueOrSent) return;
    const res = await sendReminder(overdueOrSent.id, 'telegram');
    setToastMsg(res.message);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-main">
        <Header
          title={t('reminders.title')}
          subtitle={t('reminders.subtitle')}
          action={
            <button onClick={handleTestDispatch} className="btn btn-secondary btn-sm">
              <Send size={15} />
              <span>{t('reminders.testSend')}</span>
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
              <Check size={18} />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2" style={{ marginBottom: '24px' }}>
            <button
              onClick={() => setActiveTab('rules')}
              className={`btn btn-sm ${activeTab === 'rules' ? 'btn-primary' : 'btn-outline'}`}
            >
              <BellRing size={15} />
              <span>{t('reminders.rulesTab')}</span>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`btn btn-sm ${activeTab === 'templates' ? 'btn-primary' : 'btn-outline'}`}
            >
              <MessageSquareCode size={15} />
              <span>{t('reminders.templatesTab')}</span>
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`btn btn-sm ${activeTab === 'logs' ? 'btn-primary' : 'btn-outline'}`}
            >
              <History size={15} />
              <span>{t('reminders.historyTab')} ({reminderLogs.length})</span>
            </button>
          </div>

          {/* TAB 1: RULES CONFIGURATOR */}
          {activeTab === 'rules' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Avtomatik yuborish jadvali</h3>
                  <p className="card-subtitle">
                    Faktura to'lov muddatlariga qarab eslatma yuborish qoidalari
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {reminderRules.map((rule) => {
                  let offsetLabel = '';
                  if (rule.offset_days < 0) offsetLabel = `Muddatdan ${Math.abs(rule.offset_days)} kun oldin`;
                  else if (rule.offset_days === 0) offsetLabel = "To'lov muddati kuni";
                  else offsetLabel = `${rule.offset_days} kun kechikganda`;

                  return (
                    <div
                      key={rule.id}
                      style={{
                        padding: '16px 20px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: rule.is_active ? 'var(--bg-card)' : 'var(--bg-muted)',
                        opacity: rule.is_active ? 1 : 0.6,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={rule.is_active}
                          onChange={() => handleToggleRule(rule.id, rule.is_active)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <div>
                          <p className="font-semibold text-sm">{offsetLabel}</p>
                          <p className="text-xs text-muted">
                            Mavzu: {rule.template_subject[locale as 'uz' | 'ru' | 'en'] || rule.template_subject.uz}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <select
                          value={rule.channel}
                          onChange={(e) => handleChannelChange(rule.id, e.target.value as any)}
                          className="form-select"
                          style={{ width: '160px', padding: '6px 10px', fontSize: '0.8125rem' }}
                        >
                          <option value="both">Email + Telegram</option>
                          <option value="telegram">Faqat Telegram</option>
                          <option value="email">Faqat Email</option>
                        </select>

                        <span className={`badge ${rule.is_active ? 'badge-success' : 'badge-neutral'}`}>
                          {rule.is_active ? 'Faol' : "O'chiq"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TEMPLATES EDITOR (3 LANGUAGES) */}
          {activeTab === 'templates' && (
            <div className="grid grid-cols-3 gap-6">
              {/* Rules List */}
              <div className="card">
                <h4 style={{ marginBottom: '12px', fontSize: '0.9375rem' }}>Eslatma bosqichlari</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {reminderRules.map((rule) => {
                    const isSel = rule.id === selectedRuleId;
                    return (
                      <button
                        key={rule.id}
                        type="button"
                        onClick={() => setSelectedRuleId(rule.id)}
                        className={`btn btn-sm ${isSel ? 'btn-primary' : 'btn-outline'}`}
                        style={{ justifyContent: 'flex-start' }}
                      >
                        {rule.offset_days < 0
                          ? `-${Math.abs(rule.offset_days)} kun oldin`
                          : rule.offset_days === 0
                          ? 'Muddat kuni'
                          : `+${rule.offset_days} kun kechikish`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Editor */}
              <div className="card" style={{ gridColumn: 'span 2' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
                  <h3 className="card-title">Xabar shabloni tahrirchisi</h3>
                  {/* Language switch */}
                  <div className="flex items-center gap-1">
                    {(['uz', 'ru', 'en'] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setTemplateLang(l)}
                        className={`btn btn-sm ${templateLang === l ? 'btn-accent' : 'btn-outline'}`}
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Xabar mavzusi ({templateLang.toUpperCase()})</label>
                  <input
                    type="text"
                    className="form-input"
                    value={selectedRule?.template_subject[templateLang] || ''}
                    onChange={(e) => {
                      if (!selectedRule) return;
                      const nextSubjects = { ...selectedRule.template_subject, [templateLang]: e.target.value };
                      updateReminderRule(selectedRule.id, { template_subject: nextSubjects });
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Xabar matni ({templateLang.toUpperCase()})</label>
                  <textarea
                    rows={5}
                    className="form-textarea"
                    value={selectedRule?.template_body[templateLang] || ''}
                    onChange={(e) => {
                      if (!selectedRule) return;
                      const nextBodies = { ...selectedRule.template_body, [templateLang]: e.target.value };
                      updateReminderRule(selectedRule.id, { template_body: nextBodies });
                    }}
                  />
                </div>

                <div
                  style={{
                    background: 'var(--bg-muted)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <p className="font-semibold" style={{ marginBottom: '4px' }}>Mavjud dinamik parametrlar:</p>
                  <code>#{`{client_name}`}</code>, <code>#{`{invoice_number}`}</code>, <code>#{`{amount}`}</code>, <code>#{`{due_date}`}</code>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DISPATCH LOGS */}
          {activeTab === 'logs' && (
            <div className="card" style={{ padding: 0 }}>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Faktura</th>
                      <th>Mijoz</th>
                      <th>Kanal</th>
                      <th>{t('reminders.recipient')}</th>
                      <th>Holat</th>
                      <th style={{ textAlign: 'right' }}>{t('reminders.sentAt')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reminderLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="font-semibold">{log.invoice_number || 'INV-2026-004'}</td>
                        <td>{log.client_name || 'Mijoz'}</td>
                        <td>
                          <span className={`badge ${log.channel === 'telegram' ? 'badge-info' : 'badge-neutral'}`}>
                            {log.channel === 'telegram' ? 'Telegram' : 'Email'}
                          </span>
                        </td>
                        <td className="text-sm">{log.recipient}</td>
                        <td>
                          <span className="badge badge-success">Yetkazildi</span>
                        </td>
                        <td style={{ textAlign: 'right' }} className="text-xs text-muted">
                          {formatDate(log.sent_at, locale)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
