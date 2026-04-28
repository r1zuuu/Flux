import { auth } from "@/app/auth";
import db from "@/lib/db"
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
    const session = await auth();
    if (!session) {
        redirect("/login")
    }

    const accounts = await db.financialAccount.findMany({
        where: {
            userId: session.user.id
        }
    })

    const totalBalance = accounts.reduce((sum, account) => {
        return sum + account.currentBalance.toNumber()
    }, 0)

    return (
        <div className="flex w-full flex-col gap-12">
            <section className="border-b border-border pb-10">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="text-xs font-medium uppercase tracking-[0.26em] text-primary">Overview</p>
                        <h1 className="mt-3 font-serif text-5xl leading-[0.95] text-foreground md:text-7xl">
                            Portfolio statement
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground">
                            A consolidated view of linked accounts, balances, and recent account structure prepared for quiet daily review.
                        </p>
                    </div>
                    <div className="min-w-fit border-l border-border pl-6">
                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Total balance</p>
                        <p className="mt-2 font-serif text-4xl leading-none text-primary md:text-5xl">
                            {formatCurrency(totalBalance)}
                        </p>
                        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            {accounts.length} linked {accounts.length === 1 ? "account" : "accounts"}
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
                <div>
                    <div className="mb-5 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Accounts</p>
                            <h2 className="mt-2 font-serif text-3xl text-foreground">Custody overview</h2>
                        </div>
                        <button className="w-fit border border-primary px-4 py-2 text-xs uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground active:translate-y-px">
                            Add account
                        </button>
                    </div>

                    <div className="divide-y divide-border">
                        {accounts.map((account) => (
                            <Link
                                href={`/accounts/${account.id}`}
                                key={account.id}
                                className="group grid gap-4 py-6 transition-colors hover:bg-muted/40 sm:grid-cols-[minmax(0,1.3fr)_8rem_minmax(0,0.8fr)] sm:items-center sm:px-3"
                            >
                                <div>
                                    <p className="font-serif text-2xl leading-tight text-foreground group-hover:text-primary">
                                        {account.name}
                                    </p>
                                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        Account ending {account.mask}
                                    </p>
                                </div>
                                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                    {account.type}
                                </div>
                                <div className="font-serif text-2xl text-foreground tabular-nums sm:text-right">
                                    {formatCurrency(account.currentBalance.toNumber())}
                                </div>
                            </Link>
                        ))}

                        {accounts.length === 0 && (
                            <div className="py-16">
                                <p className="font-serif text-3xl text-foreground">No linked accounts</p>
                                <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                                    Connect an account to begin building a private balance sheet and monthly spending record.
                                </p>
                                <button className="mt-6 border border-primary px-4 py-2 text-xs uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                                    Connect bank
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <aside className="border-t border-border pt-6 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">House view</p>
                    <h2 className="mt-2 font-serif text-3xl text-foreground">Capital notes</h2>
                    <div className="mt-6 divide-y divide-border text-sm leading-6 text-muted-foreground">
                        <p className="py-4">
                            Liquidity remains the primary signal in this view. Review balances monthly before reallocating capital.
                        </p>
                        <p className="py-4">
                            Spending analytics are calculated from linked account history and presented as a reference, not advice.
                        </p>
                        <p className="py-4 text-xs uppercase tracking-[0.18em] text-primary">
                            Last prepared for {session.user.name || "account holder"}
                        </p>
                    </div>
                </aside>
            </section>
        </div>
    );
}
