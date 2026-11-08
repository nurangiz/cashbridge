export type UserRole = 'owner' | 'accountant' | 'viewer';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'bank_transfer' | 'payme' | 'click' | 'cash';
export type ReminderChannel = 'email' | 'telegram' | 'both';
export type SubscriptionPlan = 'free' | 'pro' | 'business';

export interface Company {
  id: string;
  name: string;
  tax_id: string; // STIR / INN
  phone?: string;
  email?: string;
  address?: string;
  currency: 'UZS' | 'USD' | 'EUR' | 'RUB';
  default_locale: 'uz' | 'ru' | 'en';
  telegram_bot_token?: string;
  telegram_chat_id?: string;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  company_id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string;
  created_at?: string;
}

export interface Client {
  id: string;
  company_id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  telegram?: string;
  tax_id?: string;
  address?: string;
  reliability_score: number; // 0 - 100
  avg_delay_days: number;
  status: 'active' | 'archived';
  created_at: string;
  total_invoiced?: number;
  total_overdue?: number;
  invoices_count?: number;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  company_id: string;
  client_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  currency: 'UZS' | 'USD' | 'EUR' | 'RUB';
  status: InvoiceStatus;
  notes?: string;
  pdf_url?: string;
  sent_at?: string;
  paid_at?: string;
  created_at: string;
  // joined fields
  client?: Client;
  items?: InvoiceItem[];
}

export interface Payment {
  id: string;
  company_id: string;
  invoice_id: string;
  amount: number;
  payment_method: PaymentMethod;
  paid_at: string;
  transaction_reference?: string;
  notes?: string;
}

export interface ReminderRule {
  id: string;
  company_id: string;
  offset_days: number; // -3, 0, 3, 7, 14
  trigger_condition: 'before_due' | 'on_due' | 'overdue';
  channel: ReminderChannel;
  is_active: boolean;
  template_subject: { [key in 'uz' | 'ru' | 'en']: string };
  template_body: { [key in 'uz' | 'ru' | 'en']: string };
}

export interface ReminderLog {
  id: string;
  company_id: string;
  invoice_id: string;
  client_id: string;
  channel: 'email' | 'telegram';
  recipient: string;
  status: 'sent' | 'delivered' | 'failed';
  error_message?: string;
  sent_at: string;
  invoice_number?: string;
  client_name?: string;
}

export interface CashFlowDay {
  date: string;
  dayLabel: string;
  expectedAmount: number;
  overdueAmount: number;
  invoices: {
    id: string;
    number: string;
    clientName: string;
    amount: number;
    status: InvoiceStatus;
  }[];
}

export interface WaitlistLead {
  id?: string;
  full_name: string;
  company_name?: string;
  email: string;
  phone?: string;
  source?: string;
  created_at?: string;
}
