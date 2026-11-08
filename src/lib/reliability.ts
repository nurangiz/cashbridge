// Reliability scoring algorithm for CashBridge clients (0 - 100)
import { Invoice } from '@/types/database';

export interface ReliabilityResult {
  score: number;
  avgDelayDays: number;
  totalInvoices: number;
  paidOnTime: number;
  paidLate: number;
  currentlyOverdue: number;
  explanation: string;
}

export function calculateClientReliability(
  clientInvoices: Invoice[]
): ReliabilityResult {
  if (!clientInvoices || clientInvoices.length === 0) {
    return {
      score: 100,
      avgDelayDays: 0,
      totalInvoices: 0,
      paidOnTime: 0,
      paidLate: 0,
      currentlyOverdue: 0,
      explanation: "Yangi mijoz, hali hisob-fakturalar mavjud emas (boshlang'ich ball: 100)",
    };
  }

  const totalInvoices = clientInvoices.length;
  let paidOnTime = 0;
  let paidLate = 0;
  let currentlyOverdue = 0;
  let totalDelayDays = 0;

  const now = new Date();

  clientInvoices.forEach((inv) => {
    const dueDate = new Date(inv.due_date);

    if (inv.status === 'paid' && inv.paid_at) {
      const paidDate = new Date(inv.paid_at);
      const diffDays = Math.ceil(
        (paidDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays <= 0) {
        paidOnTime++;
      } else {
        paidLate++;
        totalDelayDays += diffDays;
      }
    } else if (inv.status === 'overdue' || (inv.status === 'sent' && dueDate < now)) {
      currentlyOverdue++;
      const overdueDays = Math.ceil(
        (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      totalDelayDays += Math.max(0, overdueDays);
    }
  });

  const countedEvents = paidLate + currentlyOverdue;
  const avgDelayDays = countedEvents > 0 ? Math.round(totalDelayDays / countedEvents) : 0;

  const overdueRatio = totalInvoices > 0 ? currentlyOverdue / totalInvoices : 0;
  const lateRatio = totalInvoices > 0 ? paidLate / totalInvoices : 0;

  let calculatedScore = 100 - avgDelayDays * 2.5 - overdueRatio * 45 - lateRatio * 20;
  if (paidOnTime > 2) {
    calculatedScore += Math.min(10, paidOnTime * 2);
  }

  const score = Math.max(5, Math.min(100, Math.round(calculatedScore)));

  let explanation = '';
  if (score >= 80) {
    explanation = "Muntazam va o'z vaqtida to'laydi. Kechikish deyarli yo'q.";
  } else if (score >= 50) {
    explanation = `O'rtacha kechikish ${avgDelayDays} kun. To'lov eslatmalarini 3 kun oldin yoqish tavsiya etiladi.`;
  } else {
    explanation = `Yuqori xavfli kontragent! O'rtacha kechikish ${avgDelayDays} kun, ${currentlyOverdue} ta muddati o'tgan faktura mavjud. Oldindan 100% to'lov tavsiya etiladi.`;
  }

  return {
    score,
    avgDelayDays,
    totalInvoices,
    paidOnTime,
    paidLate,
    currentlyOverdue,
    explanation,
  };
}
