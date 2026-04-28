"use client"

import { useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartRadarDefault } from "@/app/components/ui/chart-radar-default"
import { formatCurrency } from "@/lib/utils"

export default function MonthCard({ history }: { history: any[] }) {
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(0)
    const month = history[selectedMonthIndex]

    const radarData = month?.categoryBreakdown?.map((item: any) => ({
        category: item.name,
        amount: item.value
    })) || []

    if (!month) {
        return (
            <section className="border-b border-border pb-10">
                <p className="font-serif text-3xl text-foreground">No monthly history</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Monthly spending analysis will appear after transactions are available.
                </p>
            </section>
        )
    }

    return (
        <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-5 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.26em] text-primary">Monthly analysis</p>
                    <h2 className="mt-2 font-serif text-4xl leading-none text-foreground md:text-5xl">
                        {month.month} <span className="text-muted-foreground">{month.year}</span>
                    </h2>
                </div>

                <Select
                    onValueChange={(value) => setSelectedMonthIndex(parseInt(value))}
                    value={selectedMonthIndex.toString()}
                >
                    <SelectTrigger className="h-11 w-[190px] rounded-none border-border bg-background text-xs uppercase tracking-[0.18em] text-foreground shadow-none focus:ring-1 focus:ring-ring">
                        <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-border bg-background text-foreground shadow-none">
                        <SelectGroup>
                            {history.map((m: any, index: number) => (
                                <SelectItem
                                    key={`${m.month}-${m.year}`}
                                    value={index.toString()}
                                    className="rounded-none py-3 text-xs uppercase tracking-[0.16em] focus:bg-muted focus:text-foreground"
                                >
                                    {m.month} {m.year}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-10 lg:grid-cols-[22rem_minmax(0,1fr)]">
                <div className="divide-y divide-border border-b border-t border-border">
                    <div className="py-7">
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Total expenses</p>
                        <p className="mt-3 font-serif text-4xl leading-none text-foreground tabular-nums">
                            {formatCurrency(month.totalSpent)}
                        </p>
                    </div>
                    <div className="py-7">
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Monthly savings</p>
                        <p className="mt-3 font-serif text-4xl leading-none text-primary tabular-nums">
                            {formatCurrency(month.savings)}
                        </p>
                    </div>
                    <div className="py-7">
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Sync status</p>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Data prepared from the linked institution for reference review.
                        </p>
                    </div>
                </div>

                <div className="border-b border-t border-border py-7">
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Spending structure</p>
                            <h3 className="mt-2 font-serif text-3xl text-foreground">Category allocation</h3>
                        </div>
                    </div>
                    <ChartRadarDefault
                        title=""
                        description=""
                        data={radarData}
                        label="Amount"
                    />
                </div>
            </div>
        </section>
    )
}
