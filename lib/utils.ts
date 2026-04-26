import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}


export const generateMockAnalytics = (accountId: string, totalBalance: number) => {
  const categories = [
    { name: "Entertainment", icon: "🎬", color: "#8b5cf6" },
    { name: "Food", icon: "🍕", color: "#f97316" },
    { name: "Bills", icon: "🏠", color: "#3b82f6" },
    { name: "Transport", icon: "🚗", color: "#ef4444" },
    { name: "Savings", icon: "💰", color: "#10b981" },
  ];

  const months = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = monthDate.toLocaleString('en-US', { month: 'long' });

    const daysInMonth = new Array(30).fill(0).map((_, index) => {

      const dayTransactions = categories.map(cat => ({
        category: cat.name,

        amount: cat.name === "Bills"
          ? (index === 0 ? Math.random() * 500 + 1000 : 0)
          : Math.random() * 150,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), index + 1)
      }));

      return {
        day: index + 1,
        totalSpent: dayTransactions.reduce((sum, t) => sum + t.amount, 0),
        transactions: dayTransactions.filter(t => t.amount > 0)
      };
    });

    const monthlyTotal = daysInMonth.reduce((sum, d) => sum + d.totalSpent, 0);

    months.push({
      month: monthName,
      year: monthDate.getFullYear(),
      totalSpent: monthlyTotal,
      savings: monthlyTotal * 0.2, // Załóżmy, że user odkłada 20%
      data: daysInMonth,
      categoryBreakdown: categories.map(cat => ({
        name: cat.name,
        value: Math.round(Math.random() * 1000 + 500),
        color: cat.color
      }))
    });
  }

  const totalSpentInYear = months.reduce((sum, m) => sum + m.totalSpent, 0);
  const averageMonthlySpending = totalSpentInYear / 12;

  return {
    accountId,
    history: months,
    totalBalance,
    averageMonthlySpending,
  };
};