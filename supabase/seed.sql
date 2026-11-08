-- CashBridge Seed Demo Data
-- Realistic Uzbek B2B company, diverse clients, realistic invoices and payment history

-- 1. Demo Company
INSERT INTO companies (
    id, name, tax_id, phone, email, address, currency, default_locale, telegram_chat_id
) VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'Smart Logistics MCHJ',
    '309876543',
    '+998 71 200 45 45',
    'finance@smartlogistics.uz',
    'Toshkent sh., Mirobod t., Nukus ko''chasi 29-uy',
    'UZS',
    'uz',
    '@smartlogistics_uz_bot'
) ON CONFLICT (id) DO NOTHING;

-- 2. Demo User / Owner
INSERT INTO users (
    id, company_id, role, full_name, email, phone
) VALUES (
    'u0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'owner',
    'Alisher Qodirov',
    'alisher@smartlogistics.uz',
    '+998 90 123 45 67'
) ON CONFLICT (id) DO NOTHING;

-- 3. Demo Subscription
INSERT INTO subscriptions (
    company_id, plan, status, invoice_limit_per_month
) VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'pro',
    'active',
    100
) ON CONFLICT DO NOTHING;

-- 4. Demo Clients with varying reliability scores
INSERT INTO clients (
    id, company_id, name, contact_person, email, phone, telegram, tax_id, address, reliability_score, avg_delay_days, status
) VALUES 
(
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Artel Electronics Distribution',
    'Bobur Mirzayev',
    'b.mirzayev@artel.uz',
    '+998 97 701 11 22',
    '@bobur_artel',
    '301234567',
    'Toshkent sh., Chilonzor t., Qatortol 1',
    96,
    1,
    'active'
),
(
    'a0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    'Korzinka Retail QK',
    'Dilnoza Karimova',
    'd.karimova@korzinka.uz',
    '+998 90 980 50 60',
    '@dilnoza_retail',
    '204567891',
    'Toshkent sh., Yakkasaroy t., Kichik Beshyog''och 5',
    88,
    3,
    'active'
),
(
    'a0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000001',
    'Akfa Building Systems',
    'Farrux Ahmedov',
    'f.ahmedov@akfa.uz',
    '+998 93 515 88 99',
    '@farrux_akfa',
    '308899112',
    'Toshkent sh., Sergeli t., Yangi Sergeli 18',
    65,
    9,
    'active'
),
(
    'a0000000-0000-0000-0000-000000000004',
    'c0000000-0000-0000-0000-000000000001',
    'Texno Trend MCHJ',
    'Sanjar Zokirov',
    'szokirov@texnotrend.uz',
    '+998 91 333 44 55',
    '@sanjar_trend',
    '306655443',
    'Toshkent sh., Shayxontohur t., Navoiy 12',
    42,
    18,
    'active'
),
(
    'a0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000001',
    'Apex Trade Impex',
    'Javohir Olimov',
    'apex.trade@mail.uz',
    '+998 94 400 00 11',
    '@apex_trade_admin',
    '305544332',
    'Toshkent sh., Olmazor t., Forobiy 7',
    28,
    26,
    'active'
)
ON CONFLICT (id) DO NOTHING;

-- 5. Invoices (diverse statuses: paid, sent, overdue, draft)
INSERT INTO invoices (
    id, company_id, client_id, invoice_number, issue_date, due_date, subtotal, tax_rate, tax_amount, discount_amount, total_amount, paid_amount, currency, status, notes, sent_at, paid_at
) VALUES
-- Invoice 1: Paid on time
(
    'b0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'INV-2026-001',
    CURRENT_DATE - INTERVAL '25 days',
    CURRENT_DATE - INTERVAL '10 days',
    25000000.00,
    12.00,
    3000000.00,
    0,
    28000000.00,
    28000000.00,
    'UZS',
    'paid',
    'Oktabr oyi transport xizmatlari to''liq to''landi',
    NOW() - INTERVAL '24 days',
    NOW() - INTERVAL '11 days'
),
-- Invoice 2: Sent (due in 5 days)
(
    'b0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'INV-2026-002',
    CURRENT_DATE - INTERVAL '10 days',
    CURRENT_DATE + INTERVAL '5 days',
    42000000.00,
    12.00,
    5040000.00,
    0,
    47040000.00,
    0.00,
    'UZS',
    'sent',
    'Noyabr birinchi o''n kunlik yetkazib berish xizmati',
    NOW() - INTERVAL '9 days',
    NULL
),
-- Invoice 3: Sent (due in 12 days)
(
    'b0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    'INV-2026-003',
    CURRENT_DATE - INTERVAL '3 days',
    CURRENT_DATE + INTERVAL '12 days',
    31250000.00,
    12.00,
    3750000.00,
    0,
    35000000.00,
    0.00,
    'UZS',
    'sent',
    'Omborxona logistika xizmatlari',
    NOW() - INTERVAL '2 days',
    NULL
),
-- Invoice 4: Overdue (by 7 days) - Late payer (Akfa)
(
    'b0000000-0000-0000-0000-000000000004',
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000003',
    'INV-2026-004',
    CURRENT_DATE - INTERVAL '22 days',
    CURRENT_DATE - INTERVAL '7 days',
    18500000.00,
    12.00,
    2220000.00,
    0,
    20720000.00,
    0.00,
    'UZS',
    'overdue',
    'Shoshilinch to''lov eslatmasi yuborilgan',
    NOW() - INTERVAL '21 days',
    NULL
),
-- Invoice 5: Overdue (by 16 days) - High risk (Texno Trend)
(
    'b0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000004',
    'INV-2026-005',
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE - INTERVAL '16 days',
    52000000.00,
    12.00,
    6240000.00,
    0,
    58240000.00,
    15000000.00, -- Partial payment
    'UZS',
    'overdue',
    'Qisman 15 mln to''langan, qolgan 43.24 mln qoldiq',
    NOW() - INTERVAL '29 days',
    NULL
),
-- Invoice 6: Overdue (by 24 days) - Extreme late payer (Apex Trade)
(
    'b0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000005',
    'INV-2026-006',
    CURRENT_DATE - INTERVAL '40 days',
    CURRENT_DATE - INTERVAL '24 days',
    75000000.00,
    12.00,
    9000000.00,
    0,
    84000000.00,
    0.00,
    'UZS',
    'overdue',
    'Pretenziya xati yuborilgan, 24 kun kechikish',
    NOW() - INTERVAL '39 days',
    NULL
),
-- Invoice 7: Draft
(
    'b0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    'INV-2026-007',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '15 days',
    15000000.00,
    12.00,
    1800000.00,
    0,
    16800000.00,
    0.00,
    'UZS',
    'draft',
    'Tayyorlanayotgan yangi hisob-faktura',
    NULL,
    NULL
)
ON CONFLICT (id) DO NOTHING;

-- 6. Invoice Items
INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, tax_rate, amount) VALUES
('b0000000-0000-0000-0000-000000000002', 'Toshkent - Samarqand yuk tashish (Fura 20t)', 3, 10000000.00, 12.00, 30000000.00),
('b0000000-0000-0000-0000-000000000002', 'Omborda tushirish va saqlash xizmati', 1, 12000000.00, 12.00, 12000000.00),
('b0000000-0000-0000-0000-000000000004', 'Konditsioner komponentlari logistikasi', 1, 18500000.00, 12.00, 18500000.00),
('b0000000-0000-0000-0000-000000000005', 'Katta hajm texnika xavfsiz transportirovkasi', 2, 26000000.00, 12.00, 52000000.00),
('b0000000-0000-0000-0000-000000000006', 'Muzlatkich uskunalar import bojxona tranziti', 1, 75000000.00, 12.00, 75000000.00);

-- 7. Reminder Rules
INSERT INTO reminder_rules (
    company_id, offset_days, trigger_condition, channel, is_active, template_subject, template_body
) VALUES
(
    'c0000000-0000-0000-0000-000000000001',
    -3,
    'before_due',
    'both',
    true,
    '{"uz": "To''lov muddatiga 3 kun qoldi: #{invoice_number}", "ru": "До срока оплаты 3 дня: #{invoice_number}", "en": "3 days until due date: #{invoice_number}"}',
    '{"uz": "Hurmatli #{client_name}, sizga #{invoice_number} raqamli faktura bo''yicha #{amount} so''m to''lov muddati #{due_date} da tugashini eslatamiz.", "ru": "Уважаемый #{client_name}, напоминаем о сроке оплаты #{amount} сум по счету #{invoice_number} до #{due_date}.", "en": "Dear #{client_name}, reminder for invoice #{invoice_number} for #{amount} due on #{due_date}."}'
),
(
    'c0000000-0000-0000-0000-000000000001',
    0,
    'on_due',
    'both',
    true,
    '{"uz": "Bugun to''lov muddati: #{invoice_number}", "ru": "Сегодня срок оплаты: #{invoice_number}", "en": "Payment due today: #{invoice_number}"}',
    '{"uz": "Hurmatli #{client_name}, #{invoice_number} raqamli hisob-fakturaning to''lov muddati bugun. Iltimos, to''lov topshirig''ini jo''nating.", "ru": "Уважаемый #{client_name}, срок оплаты по счету #{invoice_number} наступает сегодня.", "en": "Dear #{client_name}, invoice #{invoice_number} payment is due today."}'
),
(
    'c0000000-0000-0000-0000-000000000001',
    3,
    'overdue',
    'both',
    true,
    '{"uz": "Diqqat: To''lov muddati 3 kun kechikdi (#{invoice_number})", "ru": "Внимание: Просрочка 3 дня (#{invoice_number})", "en": "Attention: 3 days overdue (#{invoice_number})"}' ,
    '{"uz": "Hurmatli #{client_name}, #{invoice_number} hisob-faktura to''lovi 3 kunga kechikmoqda. Qarz summasi: #{amount} so''m.", "ru": "Уважаемый #{client_name}, платеж по счету #{invoice_number} просрочен на 3 дня. Сумма: #{amount} сум.", "en": "Dear #{client_name}, invoice #{invoice_number} is 3 days overdue. Total: #{amount}."}'
),
(
    'c0000000-0000-0000-0000-000000000001',
    7,
    'overdue',
    'both',
    true,
    '{"uz": "Ogohlantirish: 7 kunlik kechikish (#{invoice_number})", "ru": "Предупреждение: 7 дней просрочки (#{invoice_number})", "en": "Warning: 7 days overdue (#{invoice_number})"}' ,
    '{"uz": "Hurmatli #{client_name}, #{invoice_number} faktura to''lovi 7 kun kechikdi. Ishonchlilik reytingi pasayishi va xizmat to''xtatilishining oldini olish uchun bugun to''lang.", "ru": "Уважаемый #{client_name}, оплата просрочена на 7 дней.", "en": "Dear #{client_name}, invoice payment is 7 days overdue."}'
),
(
    'c0000000-0000-0000-0000-000000000001',
    14,
    'overdue',
    'both',
    true,
    '{"uz": "Oxirgi ogohlantirish: 14 kunlik kechikish (#{invoice_number})", "ru": "Финальное предупреждение: 14 дней (#{invoice_number})", "en": "Final warning: 14 days overdue (#{invoice_number})"}' ,
    '{"uz": "Hurmatli #{client_name}, hisob bo''yicha qarz 14 kundan beri to''lanmadi. Buxgalteriya da''vo arizasi tayyorlamoqda.", "ru": "Уважаемый #{client_name}, просрочка превышает 14 дней.", "en": "Dear #{client_name}, your payment is 14 days overdue."}'
);

-- 8. Reminder Logs
INSERT INTO reminder_logs (
    company_id, invoice_id, client_id, channel, recipient, status, sent_at
) VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003', 'telegram', '@farrux_akfa', 'delivered', NOW() - INTERVAL '4 days'),
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003', 'email', 'f.ahmedov@akfa.uz', 'sent', NOW() - INTERVAL '4 days'),
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000004', 'telegram', '@sanjar_trend', 'delivered', NOW() - INTERVAL '9 days'),
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000005', 'email', 'apex.trade@mail.uz', 'sent', NOW() - INTERVAL '10 days');
