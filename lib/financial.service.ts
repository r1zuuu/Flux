import { AccountBase } from 'plaid';
import db from './db';


const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#8b5cf6",
  Food: "#f97316",
  Bills: "#3b82f6",
  Transport: "#ef4444",
  Savings: "#10b981",
};

const getCategoryColor = (categoryName: string): string => {
  return CATEGORY_COLORS[categoryName] || "#6b7280";
};

const groupTransactionsByMonth = (transactions: any[]) => {
  const monthlyData = new Map<string, typeof transactions>();

  transactions.forEach((transaction) => {
    const monthKey = `${transaction.date.getFullYear()}-${transaction.date.getMonth()}`;
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, []);
    }
    monthlyData.get(monthKey)!.push(transaction);
  });

  return monthlyData;
};

const calculateCategoryBreakdown = (transactions: any[]) => {
  const categoryMap = new Map<string, number>();

  transactions.forEach((t) => {
    const catName = t.category?.name || "Other";
    categoryMap.set(catName, (categoryMap.get(catName) || 0) + Number(t.amount));
  });

  return Array.from(categoryMap.entries()).map(([name, value]) => ({
    name,
    value: Math.round(value),
    color: getCategoryColor(name),
  }));
};

const formatMonthData = (monthKey: string, transactions: any[]) => {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month, 1);
  const totalSpent = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    month: date.toLocaleString("en-US", { month: "long" }),
    year,
    totalSpent,
    savings: totalSpent * 0.2,
    categoryBreakdown: calculateCategoryBreakdown(transactions),
  };
};
//funkcja zespalajaca poprzendie
export const getAccountAnalitycs = async (accountId: string) => {

  const transactions = await db.transaction.findMany({
    where: { accountId },
    include: { category: true },
    orderBy: { date: "desc" },
  });


  const monthlyData = groupTransactionsByMonth(transactions);

  const history = Array.from(monthlyData.entries())
    .map(([monthKey, txns]) => formatMonthData(monthKey, txns))
    .reverse(); // Od najstarszego


  const totalSpentInYear = history.reduce((sum, m) => sum + m.totalSpent, 0);

  return {
    accountId,
    history,
    averageMonthlySpending:
      history.length > 0 ? totalSpentInYear / history.length : 0,
  };
};

export const createBankConnection = async (
    userId: string,
    accessToken: string,
    itemId: string,
    accounts: AccountBase[]
) => {
    return await db.$transaction(async (tx) => {


        const plaidItem = await tx.plaidItem.create({
            data: {
                accessToken: accessToken,
                itemId: itemId,
                userId: userId,
            },
        });


        const accountsData = accounts.map((account) => ({
            plaidAccountId: account.account_id,
            name: account.name,
            type: account.type ?? "depository",
            subtype: account.subtype ?? "checking",
            mask: account.mask ?? "0000",
            currentBalance: account.balances.current ?? 0,
            availableBalance: account.balances.available ?? 0,
            userId: userId,
            plaidItemId: plaidItem.id, 
        }));

        // KROK 3: Masowy zapis wszystkich kont do bazy
        await tx.financialAccount.createMany({
            data: accountsData,
        });

        return plaidItem;
    });
};