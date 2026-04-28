import Sidebar from "../components/sidebar"
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  
  if (!session) {
      redirect("/login");
  }

  return (
    <div className="flex min-h-[100dvh] bg-background font-sans text-foreground">
      <Sidebar user={session?.user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-border bg-background/95 px-5 py-4 sm:px-8">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Private ledger
              </p>
              <p className="mt-1 font-serif text-xl text-foreground">
                Consolidated wealth overview
              </p>
            </div>
            <div className="flex items-center gap-6 text-[0.72rem] uppercase tracking-[0.2em] text-muted-foreground">
              <span>USD</span>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <span>Read-only report</span>
            </div>
            <nav className="flex gap-5 border-t border-border pt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground lg:hidden">
              <Link href="/dashboard" className="transition-colors hover:text-primary">Overview</Link>
              <Link href="/transactions" className="transition-colors hover:text-primary">Transactions</Link>
              <Link href="/settings" className="transition-colors hover:text-primary">Settings</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-5 py-8 sm:px-8 lg:py-12">
          <div className="mx-auto w-full max-w-[1440px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
