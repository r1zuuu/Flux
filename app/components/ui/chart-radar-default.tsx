"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/app/components/ui/chart"
import { formatCurrency } from "@/lib/utils"

// 1. Zdefiniuj interfejs danych dla wykresu
interface RadarData {
    category: string;
    amount: number;
}

interface ChartRadarProps {
    title: string;
    description: string;
    data: RadarData[];
    label: string;
}

export function ChartRadarDefault({ title, description, data, label }: ChartRadarProps) {
    const dynamicConfig = {
        amount: {
            label: label,
            color: "var(--primary)",
        }
    } satisfies ChartConfig
    return (
        <div>
            {(title || description) && (
                <div className="mb-4 text-center">
                    {title && <h3 className="font-serif text-2xl text-foreground">{title}</h3>}
                    {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
                </div>
            )}
            <ChartContainer
                config={dynamicConfig}
                className="mx-auto aspect-square min-h-[280px] max-h-[360px] text-[0.68rem] uppercase tracking-[0.12em]"
            >
                <RadarChart data={data}>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent className="rounded-none border-border bg-background shadow-none" formatter={(value) => formatCurrency(value as number)} />}
                    />
                    <PolarAngleAxis
                        dataKey="category"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    />
                    <PolarGrid stroke="var(--border)" strokeWidth={0.75} />
                    <Radar
                        dataKey="amount"
                        stroke="var(--primary)"
                        strokeWidth={1.5}
                        fill="var(--primary)"
                        fillOpacity={0.12}
                        dot={{ r: 2.5, fill: "var(--background)", stroke: "var(--primary)", strokeWidth: 1 }}
                    />
                </RadarChart>
            </ChartContainer>
        </div>
    )
}
