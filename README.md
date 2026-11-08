# CashBridge — B2B SaaS Platform

> **O'z vaqtida to'lov oling, kassa uzilishini unuting.**  
> Kichik va o'rta bizneslar uchun avtomatlashtirilgan to'lov eslatmalari (Telegram Bot + Resend Email), mijozlar ishonchlilik reytingi (0-100) va 30 kunlik pul oqimi prognozi (Cash Flow Forecast) platformasi.

---

## 🚀 Texnologik Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling & UI:** Pure Bespoke Modern CSS Design System (Fintech Palette, Light & Dark themes, WCAG AA accessible, responsive mobile-first)
- **Icons:** `lucide-react`
- **Database & Auth:** Supabase (PostgreSQL, Multi-tenant Row Level Security (RLS) policies)
- **Ko'p tillilik (i18n):** O'zbek tili (asosiy / default), Rus tili, Ingliz tili
- **Eslatmalar:** Telegram Bot API + Resend Email API
- **Chop etish:** CSS print media PDF faktura generatori
- **Deploy:** Vercel

---

## 📁 Papka strukturasi

```
agro (cashbridge)
├── supabase/
│   ├── migrations/
│   │   └── 0001_initial_schema.sql  # Barcha jadvallar va RLS qoidalari
│   └── seed.sql                     # Realistik O'zbekiston B2B demo ma'lumotlari
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout, AppProvider, fonts, metadata
│   │   ├── globals.css              # Zamonaviy Fintech CSS dizayn tizimi
│   │   ├── page.tsx                 # Ommaviy Landing sahifa (Hero, Problem, 3-qadam, Features, Pricing, FAQ, Waitlist)
│   │   ├── pricing/page.tsx         # Batafsil tariflar taqqoslash jadvali
│   │   ├── about/page.tsx           # Biz haqimizda sahifasi
│   │   ├── contact/page.tsx         # Aloqa va qo'llab-quvvatlash
│   │   ├── privacy/page.tsx         # Maxfiylik siyosati
│   │   ├── terms/page.tsx           # Foydalanish shartlari
│   │   ├── dashboard/page.tsx       # Boshqaruv paneli (KPI, 30 kunlik grafik, top debitorlar)
│   │   ├── clients/page.tsx         # Mijozlar bazasi va 0-100 ishonchlilik reytingi
│   │   ├── invoices/page.tsx        # Fakturalar ro'yxati, filtrlash, yaratish, to'lash
│   │   ├── reminders/page.tsx       # Eslatma qoidalari, 3 tilli shablonlar, loglar
│   │   ├── forecast/page.tsx        # 30 kunlik kassa prognozi va kassa uzilishi ogohlantirishlari
│   │   └── settings/page.tsx        # Kompaniya rekvizitlari, valyuta, Telegram bot sozlash
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── LanguageSwitcher.tsx     # 🇺🇿 O'zbek / 🇷🇺 Русский / 🇬🇧 English
│   │   ├── ThemeToggle.tsx          # Kunduzgi / Tungi rejim
│   │   ├── WaitlistModal.tsx        # Landing arizalari modali
│   │   ├── ClientFormModal.tsx      # Yangi mijoz qo'shish
│   │   ├── InvoiceCreateModal.tsx   # Dinamik faktura tuzuvchi (QQS 12%)
│   │   ├── InvoiceDetailModal.tsx   # Professional PDF chop etish va jo'natish
│   │   └── RecordPaymentModal.tsx   # To'lov qabul qilish
│   ├── context/
│   │   └── AppContext.tsx           # Global reaktiv holat va tarjima funksiyasi
│   ├── lib/
│   │   ├── utils.ts                 # formatCurrency (UZS, USD), formatDate
│   │   ├── reliability.ts           # 0-100 reyting hisoblash formulasi
│   │   ├── forecast.ts              # 30 kunlik prognoz hisoblash algoritmi
│   │   └── mock-data.ts             # Boshlang'ich test ma'lumotlari
│   ├── messages/
│   │   ├── uz.json                  # O'zbekcha tarjimalar
│   │   ├── ru.json                  # Ruscha tarjimalar
│   │   └── en.json                  # Inglizcha tarjimalar
│   └── types/
│       └── database.ts              # TypeScript interfeyslari
├── .env.example
├── package.json
└── tsconfig.json
```

---

## ⚡ O'rnatish va Ishga tushirish (Local Setup)

### 1. Repozitoriy va bog'liqliklarni o'rnatish:
```bash
git clone <repo-url> cashbridge
cd cashbridge
npm install
```

### 2. Muhit o'zgaruvchilari (`.env`):
`.env.example` faylidan nusxa olib `.env.local` yarating:
```bash
cp .env.example .env.local
```

### 3. Supabase ma'lumotlar bazasini sozlash:
1. `supabase/migrations/0001_initial_schema.sql` faylini Supabase SQL Editor'da bajaring.
2. `supabase/seed.sql` fayli orqali demo kompaniya va hisob-fakturalarni yuklang.

### 4. Dasturni ishga tushirish:
```bash
npm run dev
```
Brauzerda oching: [http://localhost:3000](http://localhost:3000)

---

## 🛡️ Xavfsizlik va RLS (Row Level Security)

Har bir kompaniya faqat o'z ma'lumotlarini ko'radi. `users` jadvalidagi `company_id` orqali quyidagi RLS qoidasi barcha `invoices`, `clients`, `payments`, `reminder_rules` jadvallariga tatbiq etilgan:
```sql
CREATE POLICY "Users can CRUD invoices of their company"
ON invoices FOR ALL
USING (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()))
WITH CHECK (company_id IN (SELECT company_id FROM users WHERE id = auth.uid()));
```

---

## 📊 Biznes Mantig'i va Algoritmlar

### A. Ishonchlilik reytingi (Reliability Score: 0 - 100)
Mijozning o'rtacha kechikish kunlari va to'lov intizomiga asoslanadi:
- **80 – 100 ball:** "A'lo to'lovchi" (yashil) — deyarli kechiktirmaydi.
- **50 – 79 ball:** "O'rtacha kechikish" (sariq) — 3-9 kun kechikish.
- **0 – 49 ball:** "Yuqori xavf" (qizil) — surunkali qarzdor, 100% oldindan to'lov talab etiladi.

### B. 30 kunlik Pul oqimi (Cash Flow Forecast)
Fakturaning to'lov muddati mijozning o'rtacha kechikish kunlariga moslashtiriladi (`due_date + avg_delay_days`). Bu rahbar va buxgalterga ertaga yoki 2 haftadan keyin kassaga aniq qancha naqd pul tushishini bilish imkonini beradi.
