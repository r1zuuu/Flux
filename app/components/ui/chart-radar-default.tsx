"use client"

import { Label, PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
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
            color: "hsl(var(--chart-1))",
        }
    } satisfies ChartConfig
    return (
        <Card>
            <CardHeader className="items-center pb-4">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <ChartContainer
                    config={dynamicConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadarChart data={data}>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />} />
                        <PolarAngleAxis dataKey="category" />
                        <PolarGrid />
                        <Radar
                            dataKey="amount"
                            fill="white"
                            fillOpacity={0.6}
                            dot={{ r: 4, fillOpacity: 1 }}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}