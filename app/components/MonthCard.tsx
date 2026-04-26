"use client"
import { useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartRadarDefault } from "@/app/components/ui/chart-radar-default"
import { formatCurrency } from "@/lib/utils"

export default function MonthCard({ history }: { history: any[] }) {
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(0)
    const month = history[selectedMonthIndex]

    const radarData = month.categoryBreakdown.map((item: any) => ({
        category: item.name,
        amount: item.value
    }))

    return (
        <div className="bg-zinc-800 border-zinc-700 rounded-2xl overflow-hidden shadow-xl transition-all hover:shadow-2xl hover:border-zinc-500 border flex flex-col max-w-2xl mx-auto w-full">
            <div className="p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-2xl text-white capitalize">{month.month}</h3>
                        <p className="text-sm text-zinc-500 uppercase tracking-widest font-semibold">{month.year} Analytics</p>
                    </div>

                    <Select
                        onValueChange={(value) => setSelectedMonthIndex(parseInt(value))}
                        value={selectedMonthIndex.toString()}
                    >
                        <SelectTrigger className="w-[180px] h-10 bg-zinc-900 border-zinc-700 text-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all">
                            <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-300 rounded-xl shadow-2xl">
                            <SelectGroup className="text-center">
                                {history.map((m: any, index: number) => (
                                    <SelectItem
                                        key={`${m.month}-${m.year}`}
                                        value={index.toString()}
                                        className="hover:bg-zinc-800 focus:bg-zinc-800 rounded-lg m-1 cursor-pointer"
                                    >
                                        {m.month} {m.year}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center p-4 bg-zinc-900/50 rounded-2xl border border-zinc-700/50 backdrop-blur-sm">
                        <span className="text-2xl font-black text-white tracking-tight">
                            {formatCurrency(month.totalSpent)}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase mt-1 tracking-wider">
                            Total Expenses
                        </span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-zinc-900/50 rounded-2xl border border-zinc-700/50 backdrop-blur-sm">
                        <span className="text-2xl font-black text-emerald-400 tracking-tight">
                            {formatCurrency(month.savings)}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase mt-1 tracking-wider">
                            Monthly Savings
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-[350px] px-4 pb-4">
                <ChartRadarDefault
                    title="Spending Structure"
                    description="Breakdown by category"
                    data={radarData}
                    label="Amount"
                />
            </div>

            <div className="px-6 py-4 bg-zinc-900/80 border-t border-zinc-700/50 flex justify-between items-center">
                <div className="text-xs font-medium text-zinc-500">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    )
}