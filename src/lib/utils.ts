// Utility functions for formatting and calculations

export function formatCurrency(amount: number, currency: string = 'UZS'): string {
  if (currency === 'UZS') {
    return new Intl.NumberFormat('uz-UZ').format(Math.round(amount)) + " so'm";
  }
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }
  return new Intl.NumberFormat('ru-RU').format(amount) + ` ${currency}`;
}

export function formatDate(dateString: string, locale: string = 'uz'): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const localesMap: Record<string, string> = {
    uz: 'uz-UZ',
    ru: 'ru-RU',
    en: 'en-US',
  };
  return new Intl.DateTimeFormat(localesMap[locale] || 'uz-UZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function getDaysDifference(targetDate: string): number {
  const target = new Date(targetDate);
  const now = new Date();
  // Strip hours
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getReliabilityTier(score: number): {
  label: { uz: string; ru: string; en: string };
  badgeClass: string;
  color: string;
} {
  if (score >= 80) {
    return {
      label: {
        uz: "A'lo to'lovchi",
        ru: 'Надежный плательщик',
        en: 'Excellent Payer',
      },
      badgeClass: 'badge-success',
      color: '#10b981',
    };
  }
  if (score >= 50) {
    return {
      label: {
        uz: "O'rtacha kechikish",
        ru: 'Средний риск',
        en: 'Moderate Delay',
      },
      badgeClass: 'badge-warning',
      color: '#f59e0b',
    };
  }
  return {
    label: {
      uz: 'Yuqori xavf',
      ru: 'Высокий риск',
      en: 'High Risk',
    },
    badgeClass: 'badge-danger',
    color: '#ef4444',
  };
}

export function getInvoiceStatusLabel(status: string, locale: string = 'uz'): {
  text: string;
  className: string;
} {
  const labels: Record<string, Record<string, string>> = {
    draft: { uz: 'Qoralama', ru: 'Черновик', en: 'Draft' },
    sent: { uz: 'Yuborilgan', ru: 'Отправлен', en: 'Sent' },
    paid: { uz: "To'langan", ru: 'Оплачен', en: 'Paid' },
    overdue: { uz: "Muddati o'tgan", ru: 'Просрочен', en: 'Overdue' },
    cancelled: { uz: 'Bekor qilingan', ru: 'Отменен', en: 'Cancelled' },
  };

  const classNames: Record<string, string> = {
    draft: 'badge-neutral',
    sent: 'badge-info',
    paid: 'badge-success',
    overdue: 'badge-danger',
    cancelled: 'badge-neutral',
  };

  const text = labels[status]?.[locale] || status;
  const className = classNames[status] || 'badge-neutral';
  return { text, className };
}
