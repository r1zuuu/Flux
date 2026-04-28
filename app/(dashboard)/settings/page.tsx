export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-10">
            <section className="border-b border-border pb-10">
                <p className="text-xs font-medium uppercase tracking-[0.26em] text-primary">Settings</p>
                <h1 className="mt-3 font-serif text-5xl leading-[0.95] text-foreground md:text-7xl">
                    Account preferences
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Manage access, reporting assumptions, and institutional connection preferences.
                </p>
            </section>

            <section className="divide-y divide-border border-b border-border">
                {["Profile", "Reporting currency", "Institution links"].map((item) => (
                    <div key={item} className="grid gap-3 py-6 sm:grid-cols-[16rem_minmax(0,1fr)]">
                        <p className="font-serif text-2xl text-foreground">{item}</p>
                        <p className="text-sm leading-6 text-muted-foreground">
                            Preference controls can be added here while preserving the private banking report structure.
                        </p>
                    </div>
                ))}
            </section>
        </div>
    );
}
