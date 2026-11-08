-- CashBridge B2B SaaS MVP Database Schema
-- Multi-tenant architecture with Row-Level Security (RLS)

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50) NOT NULL, -- STIR / INN
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    currency VARCHAR(10) DEFAULT 'UZS', -- 'UZS', 'USD', 'EUR', 'RUB'
    default_locale VARCHAR(10) DEFAULT 'uz', -- 'uz', 'ru', 'en'
    telegram_bot_token TEXT,
    telegram_chat_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Users table (profiles linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY, -- matches auth.users id
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'owner', -- 'owner', 'accountant', 'viewer'
    full_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Clients table (kontragentlar)
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    telegram VARCHAR(100), -- username or telegram chat ID
    tax_id VARCHAR(50), -- STIR / INN
    address TEXT,
    reliability_score INTEGER DEFAULT 100 CHECK (reliability_score >= 0 AND reliability_score <= 100),
    avg_delay_days INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'archived'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Invoices table (hisob-fakturalar)
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    invoice_number VARCHAR(100) NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0,
    tax_rate NUMERIC(5, 2) DEFAULT 12.00, -- default QQS 12%
    tax_amount NUMERIC(15, 2) DEFAULT 0,
    discount_amount NUMERIC(15, 2) DEFAULT 0,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(15, 2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'UZS',
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'sent', 'paid', 'overdue', 'cancelled'
    notes TEXT,
    pdf_url TEXT,
    sent_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_company_invoice_number UNIQUE (company_id, invoice_number)
);

-- 6. Invoice Items (mahsulot va xizmat pozitsiyalari)
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
    unit_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    tax_rate NUMERIC(5, 2) DEFAULT 12.00,
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Payments table (to'lovlar tarixi, qisman yoki to'liq)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'bank_transfer', -- 'bank_transfer', 'payme', 'click', 'cash'
    paid_at TIMESTAMPTZ DEFAULT NOW(),
    transaction_reference VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Reminder Rules (eslatma qoidalari)
CREATE TABLE IF NOT EXISTS reminder_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    offset_days INTEGER NOT NULL, -- -3 (3 kun oldin), 0 (muddat kuni), 3, 7, 14 (keyin)
    trigger_condition VARCHAR(50) NOT NULL, -- 'before_due', 'on_due', 'overdue'
    channel VARCHAR(50) NOT NULL DEFAULT 'both', -- 'email', 'telegram', 'both'
    is_active BOOLEAN DEFAULT true,
    template_subject JSONB DEFAULT '{"uz": "To''lov eslatmasi", "ru": "Напоминание об оплате", "en": "Payment Reminder"}'::jsonb,
    template_body JSONB DEFAULT '{"uz": "Hurmatli mijoz, #{invoice_number} hisob-faktura to''lovi muddati: #{due_date}", "ru": "Уважаемый клиент, срок оплаты счета #{invoice_number}: #{due_date}", "en": "Dear client, invoice #{invoice_number} due date is: #{due_date}"}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Reminder Logs (yuborilgan eslatmalar jurnali)
CREATE TABLE IF NOT EXISTS reminder_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL, -- 'email', 'telegram'
    recipient VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'sent', -- 'sent', 'delivered', 'failed'
    error_message TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Subscriptions table (tarif rejalari)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    plan VARCHAR(50) DEFAULT 'free', -- 'free', 'pro', 'business'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'past_due', 'cancelled'
    invoice_limit_per_month INTEGER DEFAULT 5,
    renews_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Waitlist Leads table (landing page orqali arizalar)
CREATE TABLE IF NOT EXISTS waitlist_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    source VARCHAR(100) DEFAULT 'landing_page',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_leads ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user company_id
CREATE OR REPLACE FUNCTION get_auth_company_id()
RETURNS UUID AS $$
    SELECT company_id FROM users WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Companies policies
CREATE POLICY "Users can view their own company"
ON companies FOR SELECT
USING (id = get_auth_company_id());

CREATE POLICY "Owners can update their own company"
ON companies FOR UPDATE
USING (id = get_auth_company_id());

-- Users policies
CREATE POLICY "Users can view members of their company"
ON users FOR SELECT
USING (company_id = get_auth_company_id());

-- Clients policies
CREATE POLICY "Users can CRUD clients of their company"
ON clients FOR ALL
USING (company_id = get_auth_company_id())
WITH CHECK (company_id = get_auth_company_id());

-- Invoices policies
CREATE POLICY "Users can CRUD invoices of their company"
ON invoices FOR ALL
USING (company_id = get_auth_company_id())
WITH CHECK (company_id = get_auth_company_id());

-- Invoice Items policies
CREATE POLICY "Users can CRUD invoice items of their company"
ON invoice_items FOR ALL
USING (invoice_id IN (SELECT id FROM invoices WHERE company_id = get_auth_company_id()))
WITH CHECK (invoice_id IN (SELECT id FROM invoices WHERE company_id = get_auth_company_id()));

-- Payments policies
CREATE POLICY "Users can CRUD payments of their company"
ON payments FOR ALL
USING (company_id = get_auth_company_id())
WITH CHECK (company_id = get_auth_company_id());

-- Reminder Rules policies
CREATE POLICY "Users can CRUD reminder rules of their company"
ON reminder_rules FOR ALL
USING (company_id = get_auth_company_id())
WITH CHECK (company_id = get_auth_company_id());

-- Reminder Logs policies
CREATE POLICY "Users can view reminder logs of their company"
ON reminder_logs FOR SELECT
USING (company_id = get_auth_company_id());

-- Subscriptions policies
CREATE POLICY "Users can view company subscriptions"
ON subscriptions FOR SELECT
USING (company_id = get_auth_company_id());

-- Waitlist leads (anyone can insert, only service role can read)
CREATE POLICY "Anyone can join waitlist"
ON waitlist_leads FOR INSERT
WITH CHECK (true);
