export default function TransactionsPage() {
    return (
        <div className="flex flex-col gap-10">
            <section className="border-b border-border pb-10">
                <p className="text-xs font-medium uppercase tracking-[0.26em] text-primary">Transactions</p>
                <h1 className="mt-3 font-serif text-5xl leading-[0.95] text-foreground md:text-7xl">
                    Ledger activity
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Transaction review will appear here as linked account activity is categorized and reconciled.
                </p>
            </section>

            <section className="divide-y divide-border border-b border-border">
                {["Posted activity", "Pending review", "Category adjustments"].map((item) => (
                    <div key={item} className="grid gap-3 py-6 sm:grid-cols-[16rem_minmax(0,1fr)]">
                        <p className="font-serif text-2xl text-foreground">{item}</p>
                        <p className="text-sm leading-6 text-muted-foreground">
                            No entries are ready for this section yet. The ledger remains available once account data is synchronized.
                        </p>
                    </div>
                ))}
            </section>
        </div>
    );
}
