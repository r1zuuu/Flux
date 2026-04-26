import { auth } from "@/app/auth";
import db from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { formatCurrency, generateMockAnalytics } from "@/lib/utils";
import { ChartRadarDefault } from "@/app/components/ui/chart-radar-default";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
} from "@/components/ui/select"
import MonthCard from "@/app/components/MonthCard";
export default async function DetailPage({ params }: { params: Promise<{ accountId: string }> }) {
    const { accountId } = await params
    const session = await auth()
    if (!session) {
        redirect("/login")
    }
    const account = await db.financialAccount.findUnique({
        where: {
            id: accountId,
            userId: session.user.id
        },
    })
    if (!account) {
        return notFound()
    }
    const analyticsData = generateMockAnalytics(accountId, account.currentBalance.toNumber());

    return (
        <div className="p-6">
            <p className="text-gray-600 mb-6">You are inspecting {account.name}</p>

            <div className="bg-zinc-600 rounded-xl shadow-sm border p-6 mb-8">
                <h2 className="text-lg font-medium text-gray-500">Current balance</h2>
                <p className="text-4xl font-bold mt-2">{formatCurrency(account.currentBalance.toNumber())}</p>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Expenses Summary</h2>
                <p className="text-gray-600 mb-8 text-sm">Average monthly expenses: <span className="font-semibold text-black">{formatCurrency(analyticsData.averageMonthlySpending)}</span></p>

                <MonthCard history={analyticsData.history.slice(0, 12)} />
            </div>
        </div>
    )
}