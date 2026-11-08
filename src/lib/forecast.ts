// 30-day cash flow forecast engine
import { Invoice, CashFlowDay, Client } from '@/types/database';

export interface ForecastSummary {
  totalExpectedNext30Days: number;
  totalCurrentlyOverdue: number;
  totalPaidLast30Days: number;
  dailyForecast: CashFlowDay[];
  confidenceScore: number; // 0 - 100 based on client reliability
}

export function generate30DayForecast(
  invoices: Invoice[],
  clientsMap: Record<string, Client>
): ForecastSummary {
  const days: CashFlowDay[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Initialize next 30 days
  for (let i = 0; i < 30; i++) {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + i);
    const dateStr = targetDate.toISOString().split('T')[0];
    const dayLabel = targetDate.toLocaleDateString('uz-UZ', {
      day: 'numeric',
      month: 'short',
    });

    days.push({
      date: dateStr,
      dayLabel,
      expectedAmount: 0,
      overdueAmount: 0,
      invoices: [],
    });
  }

  let totalExpectedNext30Days = 0;
  let totalCurrentlyOverdue = 0;
  let totalPaidLast30Days = 0;
  let totalReliabilityWeight = 0;
  let totalInvoicesEvaluated = 0;

  invoices.forEach((inv) => {
    const remainingAmount = Math.max(0, Number(inv.total_amount) - Number(inv.paid_amount || 0));
    const client = clientsMap[inv.client_id];
    const clientScore = client ? client.reliability_score : 80;
    const clientAvgDelay = client ? client.avg_delay_days : 0;

    if (inv.status === 'paid') {
      totalPaidLast30Days += Number(inv.paid_amount || inv.total_amount);
      return;
    }

    if (inv.status === 'overdue') {
      totalCurrentlyOverdue += remainingAmount;
    }

    // Determine projected payment date
    // If client is prompt, projected date is due_date
    // If client usually delays by X days, adjust expected date by delay
    const originalDueDate = new Date(inv.due_date);
    originalDueDate.setHours(0, 0, 0, 0);

    const projectedDate = new Date(originalDueDate);
    if (clientAvgDelay > 0) {
      projectedDate.setDate(projectedDate.getDate() + Math.min(clientAvgDelay, 14));
    }

    // If projected date is in the past, place it in today or next 2 days
    if (projectedDate < now) {
      projectedDate.setTime(now.getTime() + 2 * 24 * 60 * 60 * 1000); // expect within 2 days after reminder
    }

    const diffDays = Math.round(
      (projectedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays >= 0 && diffDays < 30) {
      days[diffDays].expectedAmount += remainingAmount;
      if (inv.status === 'overdue') {
        days[diffDays].overdueAmount += remainingAmount;
      }
      days[diffDays].invoices.push({
        id: inv.id,
        number: inv.invoice_number,
        clientName: client ? client.name : 'Mijoz',
        amount: remainingAmount,
        status: inv.status,
      });

      totalExpectedNext30Days += remainingAmount;
      totalReliabilityWeight += clientScore;
      totalInvoicesEvaluated++;
    }
  });

  const confidenceScore =
    totalInvoicesEvaluated > 0
      ? Math.round(totalReliabilityWeight / totalInvoicesEvaluated)
      : 85;

  return {
    totalExpectedNext30Days,
    totalCurrentlyOverdue,
    totalPaidLast30Days,
    dailyForecast: days,
    confidenceScore,
  };
}
