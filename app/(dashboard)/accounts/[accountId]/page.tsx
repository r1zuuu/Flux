import { auth } from "@/app/auth";
import db from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { getAccountAnalitycs } from "@/lib/financial.service";
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

    const accountAnalitycs = await getAccountAnalitycs(accountId)

    return (
        <div className="flex flex-col gap-12">
            <section className="border-b border-border pb-10">
                <p className="text-xs font-medium uppercase tracking-[0.26em] text-primary">Account record</p>
                <div className="mt-3 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
                    <div>
                        <h1 className="font-serif text-5xl leading-[0.95] text-foreground md:text-7xl">
                            {account.name}
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground">
                            Inspecting account ending {account.mask}. Balances and category history are consolidated from linked transactions.
                        </p>
                    </div>
                    <div className="border-l border-border pl-6">
                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Current balance</p>
                        <p className="mt-2 font-serif text-4xl leading-none text-primary tabular-nums md:text-5xl">
                            {formatCurrency(account.currentBalance.toNumber())}
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-8 border-b border-border pb-10 md:grid-cols-3">
                <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Account type</p>
                    <p className="mt-3 font-serif text-3xl text-foreground">{account.type}</p>
                </div>
                <div className="md:border-l md:border-border md:pl-8">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Average monthly expenses</p>
                    <p className="mt-3 font-serif text-3xl text-foreground tabular-nums">
                        {formatCurrency(accountAnalitycs.averageMonthlySpending)}
                    </p>
                </div>
                <div className="md:border-l md:border-border md:pl-8">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">History reviewed</p>
                    <p className="mt-3 font-serif text-3xl text-foreground tabular-nums">
                        {accountAnalitycs.history.slice(0, 12).length} months
                    </p>
                </div>
            </section>

            <MonthCard history={accountAnalitycs.history.slice(0, 12)} />
        </div>
    )
}
