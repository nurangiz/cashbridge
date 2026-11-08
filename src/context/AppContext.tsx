'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, Client, Invoice, ReminderRule, ReminderLog, WaitlistLead } from '@/types/database';
import {
  initialCompany,
  initialClients,
  initialInvoices,
  initialReminderRules,
  initialReminderLogs,
} from '@/lib/mock-data';
import { calculateClientReliability } from '@/lib/reliability';

import uzMessages from '@/messages/uz.json';
import ruMessages from '@/messages/ru.json';
import enMessages from '@/messages/en.json';

export type Locale = 'uz' | 'ru' | 'en';
export type Theme = 'light' | 'dark';

interface AppContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: (keyPath: string) => string;
  // State
  company: Company;
  updateCompany: (company: Partial<Company>) => void;
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'created_at' | 'reliability_score' | 'avg_delay_days'>) => Client;
  updateClient: (id: string, client: Partial<Client>) => void;
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'created_at' | 'status' | 'paid_amount'>) => Invoice;
  markInvoiceAsPaid: (invoiceId: string, amount?: number) => void;
  reminderRules: ReminderRule[];
  updateReminderRule: (id: string, updates: Partial<ReminderRule>) => void;
  reminderLogs: ReminderLog[];
  sendReminder: (invoiceId: string, channel: 'email' | 'telegram') => Promise<{ success: boolean; message: string }>;
  waitlistLeads: WaitlistLead[];
  addWaitlistLead: (lead: WaitlistLead) => void;
}

const messagesMap = {
  uz: uzMessages,
  ru: ruMessages,
  en: enMessages,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('uz');
  const [theme, setThemeState] = useState<Theme>('light');

  const [company, setCompany] = useState<Company>(initialCompany);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [reminderRules, setReminderRules] = useState<ReminderRule[]>(initialReminderRules);
  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>(initialReminderLogs);
  const [waitlistLeads, setWaitlistLeads] = useState<WaitlistLead[]>([]);

  // Initialize theme and locale from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('cashbridge_theme') as Theme;
      if (savedTheme) {
        setThemeState(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
      const savedLocale = localStorage.getItem('cashbridge_locale') as Locale;
      if (savedLocale) {
        setLocaleState(savedLocale);
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cashbridge_locale', newLocale);
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cashbridge_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  // Translation helper
  const t = (keyPath: string): string => {
    const currentDict = messagesMap[locale] || messagesMap.uz;
    const parts = keyPath.split('.');
    let curr: any = currentDict;
    for (const part of parts) {
      if (curr && typeof curr === 'object' && part in curr) {
        curr = curr[part];
      } else {
        // Fallback to Uzbek
        let fb: any = messagesMap.uz;
        for (const fbPart of parts) {
          if (fb && typeof fb === 'object' && fbPart in fb) {
            fb = fb[fbPart];
          } else {
            return keyPath;
          }
        }
        return typeof fb === 'string' ? fb : keyPath;
      }
    }
    return typeof curr === 'string' ? curr : keyPath;
  };

  const updateCompany = (updates: Partial<Company>) => {
    setCompany((prev) => ({ ...prev, ...updates }));
  };

  const addClient = (newClientData: Omit<Client, 'id' | 'created_at' | 'reliability_score' | 'avg_delay_days'>): Client => {
    const newId = `client-${Date.now()}`;
    const newClient: Client = {
      ...newClientData,
      id: newId,
      created_at: new Date().toISOString(),
      reliability_score: 100, // starts at 100
      avg_delay_days: 0,
      status: 'active',
      total_invoiced: 0,
      total_overdue: 0,
      invoices_count: 0,
    };
    setClients((prev) => [newClient, ...prev]);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'status' | 'paid_amount'>): Invoice => {
    const newId = `inv-${Date.now()}`;
    const client = clients.find((c) => c.id === invoiceData.client_id);
    const newInvoice: Invoice = {
      ...invoiceData,
      id: newId,
      company_id: company.id,
      status: 'sent',
      paid_amount: 0,
      created_at: new Date().toISOString(),
      sent_at: new Date().toISOString(),
      client,
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    // Update client invoice metrics
    if (client) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === client.id
            ? {
                ...c,
                total_invoiced: (c.total_invoiced || 0) + Number(newInvoice.total_amount),
                invoices_count: (c.invoices_count || 0) + 1,
              }
            : c
        )
      );
    }

    return newInvoice;
  };

  const markInvoiceAsPaid = (invoiceId: string, customAmount?: number) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const total = Number(inv.total_amount);
        const amountToPay = customAmount !== undefined ? customAmount : total;
        const isFullyPaid = amountToPay >= total;

        return {
          ...inv,
          status: isFullyPaid ? 'paid' : inv.status,
          paid_amount: amountToPay,
          paid_at: isFullyPaid ? new Date().toISOString() : inv.paid_at,
        };
      })
    );

    // Recalculate client reliability
    const targetInvoice = invoices.find((inv) => inv.id === invoiceId);
    if (targetInvoice) {
      const clientInvoices = invoices.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: 'paid' as const, paid_at: new Date().toISOString() } : inv
      ).filter((inv) => inv.client_id === targetInvoice.client_id);

      const rel = calculateClientReliability(clientInvoices);
      setClients((prev) =>
        prev.map((c) =>
          c.id === targetInvoice.client_id
            ? {
                ...c,
                reliability_score: rel.score,
                avg_delay_days: rel.avgDelayDays,
              }
            : c
        )
      );
    }
  };

  const updateReminderRule = (id: string, updates: Partial<ReminderRule>) => {
    setReminderRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const sendReminder = async (
    invoiceId: string,
    channel: 'email' | 'telegram'
  ): Promise<{ success: boolean; message: string }> => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return { success: false, message: 'Faktura topilmadi' };

    const client = clients.find((c) => c.id === inv.client_id);
    const recipient =
      channel === 'telegram'
        ? client?.telegram || '@client_bot'
        : client?.email || 'client@example.uz';

    const newLog: ReminderLog = {
      id: `log-${Date.now()}`,
      company_id: company.id,
      invoice_id: inv.id,
      client_id: inv.client_id,
      channel,
      recipient,
      status: 'delivered',
      sent_at: new Date().toISOString(),
      invoice_number: inv.invoice_number,
      client_name: client?.name || 'Mijoz',
    };

    setReminderLogs((prev) => [newLog, ...prev]);

    return {
      success: true,
      message: `${channel === 'telegram' ? 'Telegram' : 'Email'} orqali ${recipient} ga eslatma muvaffaqiyatli yuborildi!`,
    };
  };

  const addWaitlistLead = (lead: WaitlistLead) => {
    const newLead = { ...lead, id: `lead-${Date.now()}`, created_at: new Date().toISOString() };
    setWaitlistLeads((prev) => [newLead, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        theme,
        setTheme,
        toggleTheme,
        t,
        company,
        updateCompany,
        clients,
        addClient,
        updateClient,
        invoices,
        addInvoice,
        markInvoiceAsPaid,
        reminderRules,
        updateReminderRule,
        reminderLogs,
        sendReminder,
        waitlistLeads,
        addWaitlistLead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
