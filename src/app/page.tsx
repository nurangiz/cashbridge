'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WaitlistModal } from '@/components/WaitlistModal';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingDown,
  PhoneCall,
  BellRing,
  Award,
  TrendingUp,
  FileSpreadsheet,
  Globe2,
  Lock,
  ChevronDown,
  Sparkles,
  Send,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  const { t } = useApp();
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenWaitlist={() => setWaitlistOpen(true)} />

      <main style={{ flex: 1 }}>
        {/* =================================================================
            HERO SECTION
        ================================================================== */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>{t('landing.hero.badge')}</span>
            </div>

            <h1 className="hero-title">{t('landing.hero.title')}</h1>

            <p className="hero-subtitle">{t('landing.hero.subtitle')}</p>

            <div className="flex items-center justify-center gap-4 flex-wrap" style={{ marginBottom: '40px' }}>
              <button
                onClick={() => setWaitlistOpen(true)}
                type="button"
                className="btn btn-accent btn-lg"
              >
                <span>{t('landing.hero.ctaPrimary')}</span>
                <ArrowRight size={18} />
              </button>

              <Link href="/dashboard" className="btn btn-secondary btn-lg">
                <span>{t('landing.hero.ctaSecondary')}</span>
              </Link>
            </div>

            {/* Interactive Preview Mockup */}
            <div
              style={{
                maxWidth: '940px',
                margin: '0 auto',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                boxShadow: 'var(--shadow-xl)',
                overflow: 'hidden',
                textAlign: 'left',
              }}
            >
              {/* Fake Window Header */}
              <div
                style={{
                  background: 'var(--bg-muted)',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                <span className="text-xs text-muted" style={{ marginLeft: '12px' }}>
                  cashbridge.uz/dashboard — Jonli demo paneli
                </span>
              </div>

              {/* Preview Content */}
              <div style={{ padding: '24px' }}>
                <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '24px' }}>
                  <div className="stat-card" style={{ padding: '16px' }}>
                    <span className="stat-label">Jami to'lanmagan</span>
                    <span className="stat-value" style={{ fontSize: '1.35rem', color: 'var(--accent-blue)' }}>
                      244 000 000 so'm
                    </span>
                    <span className="text-xs text-muted">5 ta mijoz</span>
                  </div>
                  <div className="stat-card" style={{ padding: '16px' }}>
                    <span className="stat-label">Muddati o'tgan</span>
                    <span className="stat-value" style={{ fontSize: '1.35rem', color: 'var(--accent-red)' }}>
                      147 960 000 so'm
                    </span>
                    <span className="text-xs" style={{ color: 'var(--accent-red)' }}>3 ta kechikkan faktura</span>
                  </div>
                  <div className="stat-card" style={{ padding: '16px' }}>
                    <span className="stat-label">30 kunlik prognoz</span>
                    <span className="stat-value" style={{ fontSize: '1.35rem', color: 'var(--accent-green)' }}>
                      82 040 000 so'm
                    </span>
                    <span className="text-xs" style={{ color: 'var(--accent-green)' }}>92% ishonchlilik</span>
                  </div>
                  <div className="stat-card" style={{ padding: '16px' }}>
                    <span className="stat-label">O'rtacha kechikish</span>
                    <span className="stat-value" style={{ fontSize: '1.35rem' }}>
                      8.4 kun
                    </span>
                    <span className="text-xs text-muted">Oldingi oyga nisbatan -24%</span>
                  </div>
                </div>

                {/* Telegram Bot Simulation Banner */}
                <div
                  style={{
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #38bdf8',
                    background: 'rgba(56, 189, 248, 0.08)',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#0284c7',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Send size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Avtomatik Telegram eslatmasi (Namuna)</p>
                      <p className="text-xs text-muted">
                        "Hurmatli Artel Electronics, INV-2026-002 hisob-fakturaning to'lov muddati 5 kunda tugaydi. Summa: 47 040 000 so'm."
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-success">Yetkazildi</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            PROBLEM SECTION
        ================================================================== */}
        <section style={{ padding: '80px 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 50px' }}>
              <h2 style={{ marginBottom: '16px' }}>{t('landing.problem.title')}</h2>
              <p className="text-secondary">
                O'zbekistondagi har ikkinchi korxona debitorlik qarzlari va noaniq tushumlar sabab aylanma mablag' taqchilligiga uchraydi.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="card">
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--accent-red-bg)',
                    color: 'var(--accent-red)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <Clock size={24} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>{t('landing.problem.p1Title')}</h3>
                <p className="text-sm text-secondary">{t('landing.problem.p1Desc')}</p>
              </div>

              <div className="card">
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--accent-amber-bg)',
                    color: 'var(--accent-amber)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <TrendingDown size={24} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>{t('landing.problem.p2Title')}</h3>
                <p className="text-sm text-secondary">{t('landing.problem.p2Desc')}</p>
              </div>

              <div className="card">
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--accent-blue-bg)',
                    color: 'var(--accent-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <PhoneCall size={24} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '10px' }}>{t('landing.problem.p3Title')}</h3>
                <p className="text-sm text-secondary">{t('landing.problem.p3Desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            HOW IT WORKS (3 STEPS)
        ================================================================== */}
        <section id="how-it-works" style={{ padding: '80px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
              <h2 style={{ marginBottom: '16px' }}>{t('landing.howItWorks.title')}</h2>
              <p className="text-secondary">{t('landing.howItWorks.subtitle')}</p>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="card" style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    top: '-16px',
                    left: '24px',
                    background: 'var(--primary)',
                    color: '#fff',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                  }}
                >
                  1
                </span>
                <h3 style={{ fontSize: '1.2rem', marginTop: '12px', marginBottom: '10px' }}>
                  {t('landing.howItWorks.step1Title')}
                </h3>
                <p className="text-sm text-secondary">{t('landing.howItWorks.step1Desc')}</p>
              </div>

              <div className="card" style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    top: '-16px',
                    left: '24px',
                    background: 'var(--accent-green)',
                    color: '#fff',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                  }}
                >
                  2
                </span>
                <h3 style={{ fontSize: '1.2rem', marginTop: '12px', marginBottom: '10px' }}>
                  {t('landing.howItWorks.step2Title')}
                </h3>
                <p className="text-sm text-secondary">{t('landing.howItWorks.step2Desc')}</p>
              </div>

              <div className="card" style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    top: '-16px',
                    left: '24px',
                    background: 'var(--accent-blue)',
                    color: '#fff',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                  }}
                >
                  3
                </span>
                <h3 style={{ fontSize: '1.2rem', marginTop: '12px', marginBottom: '10px' }}>
                  {t('landing.howItWorks.step3Title')}
                </h3>
                <p className="text-sm text-secondary">{t('landing.howItWorks.step3Desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            FEATURES GRID
        ================================================================== */}
        <section id="features" style={{ padding: '80px 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
              <h2 style={{ marginBottom: '16px' }}>{t('landing.features.title')}</h2>
              <p className="text-secondary">Zamonaviy B2B moliya vositalari — buxgalter va rahbar uchun qulay ko'rinishda.</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="card">
                <div className="feature-icon-box"><BellRing size={24} /></div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>{t('landing.features.f1Title')}</h3>
                <p className="text-sm text-secondary">{t('landing.features.f1Desc')}</p>
              </div>

              <div className="card">
                <div className="feature-icon-box" style={{ background: 'var(--accent-green-bg)', color: 'var(--accent-green)' }}>
                  <Award size={24} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>{t('landing.features.f2Title')}</h3>
                <p className="text-sm text-secondary">{t('landing.features.f2Desc')}</p>
              </div>

              <div className="card">
                <div className="feature-icon-box"><TrendingUp size={24} /></div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>{t('landing.features.f3Title')}</h3>
                <p className="text-sm text-secondary">{t('landing.features.f3Desc')}</p>
              </div>

              <div className="card">
                <div className="feature-icon-box"><FileSpreadsheet size={24} /></div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>{t('landing.features.f4Title')}</h3>
                <p className="text-sm text-secondary">{t('landing.features.f4Desc')}</p>
              </div>

              <div className="card">
                <div className="feature-icon-box"><Globe2 size={24} /></div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>{t('landing.features.f5Title')}</h3>
                <p className="text-sm text-secondary">{t('landing.features.f5Desc')}</p>
              </div>

              <div className="card">
                <div className="feature-icon-box"><Lock size={24} /></div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>{t('landing.features.f6Title')}</h3>
                <p className="text-sm text-secondary">{t('landing.features.f6Desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            PRICING SECTION
        ================================================================== */}
        <section id="pricing" style={{ padding: '80px 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
              <h2 style={{ marginBottom: '16px' }}>{t('landing.pricing.title')}</h2>
              <p className="text-secondary">{t('landing.pricing.subtitle')}</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Free Plan */}
              <div className="card flex flex-col justify-between">
                <div>
                  <h3 style={{ fontSize: '1.3rem' }}>{t('landing.pricing.free')}</h3>
                  <p className="text-xs text-muted" style={{ marginTop: '4px' }}>{t('landing.pricing.freeDesc')}</p>
                  <div style={{ margin: '24px 0' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{t('landing.pricing.freePrice')}</span>
                    <span className="text-xs text-muted"> / {t('landing.pricing.freePeriod')}</span>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }} className="text-sm text-secondary">
                    <li className="flex items-center gap-2">
                      <Check size={16} style={{ color: 'var(--accent-green)' }} />
                      <span>{t('landing.pricing.freeLimit')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={16} style={{ color: 'var(--accent-green)' }} />
                      <span>Email orqali eslatmalar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={16} style={{ color: 'var(--accent-green)' }} />
                      <span>Mijozlar ishonchlilik reytingi</span>
                    </li>
                  </ul>
                </div>
                <button onClick={() => setWaitlistOpen(true)} className="btn btn-outline" style={{ marginTop: '30px' }}>
                  {t('landing.pricing.choosePlan')}
                </button>
              </div>

              {/* Pro Plan (Highlighted) */}
              <div
                className="card flex flex-col justify-between"
                style={{
                  borderColor: 'var(--accent-green)',
                  boxShadow: 'var(--shadow-lg)',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '24px',
                    background: 'var(--accent-green)',
                    color: '#fff',
                    padding: '2px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  Tavsiya etiladi
                </span>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--accent-green)' }}>{t('landing.pricing.pro')}</h3>
                  <p className="text-xs text-muted" style={{ marginTop: '4px' }}>{t('landing.pricing.proDesc')}</p>
                  <div style={{ margin: '24px 0' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{t('landing.pricing.proPrice')}</span>
                    <span className="text-xs text-muted"> {t('landing.pricing.proPeriod')}</span>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }} className="text-sm text-secondary">
                    <li className="flex items-center gap-2">
                      <Check size={16} style={{ color: 'var(--accent-green)' }} />
                      <span>{t('landing.pricing.proLimit')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={16} style={{ color: 'var(--accent-green)' }} />
                      <span>Telegram Bot + Resend Email</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={16} style={{ color: 'var(--accent-green)' }} />
                      <span>30 kunlik Pul oqimi prognozi grafigi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={16} style={{ color: 'var(--accent-green)' }} />
                      <span>Professional PDF fakturalar</span>
                    </li>
                  </ul>
                </div>
                <button onClick={() => setWaitlistOpen(true)} className="btn btn-accent" style={{ marginTop: '30px' }}>
                  {t('landing.pricing.choosePlan')}
                </button>
              </div>

              {/* Business Plan */}
              <div className="card flex flex-col justify-between">
                <div>
                  <h3 style={{ fontSize: '1.3rem' }}>{t('landing.pricing.business')}</h3>
                  <p className="text-xs text-muted" style={{ marginTop: '4px' }}>{t('landing.pricing.businessDesc')}</p>
                  <div style={{ margin: '24px 0' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{t('landing.pricing.businessPrice')}</span>
                    <span className="text-xs text-muted"> {t('landing.pricing.businessPeriod')}</span>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }} className="text-sm text-secondary">
                    <li className="flex items-center gap-2">
                      <Check size={16} style={{ color: 'var(--accent-green)' }} />
                      <span>{t('landing.pricing.businessLimit')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={16} style={{ color: 'var(--accent-green)' }} />
                      <span>Ko'p foydalanuvchili rejim (Buxgalter + Egasi)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={16} style={{ color: 'var(--accent-green)' }} />
                      <span>Shaxsiy Telegram bot integratsiyasi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={16} style={{ color: 'var(--accent-green)' }} />
                      <span>VIP qo'llab-quvvatlash va shaxsiy menejer</span>
                    </li>
                  </ul>
                </div>
                <button onClick={() => setWaitlistOpen(true)} className="btn btn-outline" style={{ marginTop: '30px' }}>
                  {t('landing.pricing.choosePlan')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            FAQ SECTION
        ================================================================== */}
        <section id="faq" style={{ padding: '80px 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
          <div className="container" style={{ maxWidth: '820px' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 style={{ marginBottom: '16px' }}>{t('landing.faq.title')}</h2>
              <p className="text-secondary">Platforma bo'yicha eng muhim savollarga javoblar</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { q: t('landing.faq.q1'), a: t('landing.faq.a1') },
                { q: t('landing.faq.q2'), a: t('landing.faq.a2') },
                { q: t('landing.faq.q3'), a: t('landing.faq.a3') },
              ].map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-card)',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      style={{
                        width: '100%',
                        padding: '18px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={18}
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          color: 'var(--text-muted)',
                        }}
                      />
                    </button>
                    {isOpen && (
                      <div
                        style={{
                          padding: '0 20px 20px',
                          color: 'var(--text-secondary)',
                          fontSize: '0.9375rem',
                          lineHeight: 1.6,
                        }}
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================================
            BOTTOM CTA BANNER
        ================================================================== */}
        <section style={{ padding: '80px 0', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: '780px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{t('landing.cta.title')}</h2>
            <p className="text-secondary" style={{ fontSize: '1.15rem', marginBottom: '32px' }}>
              {t('landing.cta.subtitle')}
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button onClick={() => setWaitlistOpen(true)} className="btn btn-accent btn-lg">
                <span>{t('landing.cta.joinWaitlist')}</span>
                <ArrowRight size={18} />
              </button>
              <Link href="/dashboard" className="btn btn-secondary btn-lg">
                <span>{t('landing.hero.ctaSecondary')}</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <WaitlistModal isOpen={waitlistOpen} onClose={() => setWaitlistOpen(false)} />
    </div>
  );
}
