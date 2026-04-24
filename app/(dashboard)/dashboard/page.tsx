import { auth } from "@/app/auth";
import db from "@/lib/db"
import { redirect } from "next/navigation";
import Link from "next/link";
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
    return (
        <div className="min-h-screen w-full px-4 py-8 sm:px-6">
            <div className="relative z-10 mx-auto w-full max-w-7xl">
                <h1 className="text-4xl font-bold text-white">Welcome to your dashboard!</h1>
                <p className="mt-2 text-zinc-400">View and manage your finances</p>
                <div className="grid grid-cols-3 gap-6">
                    {accounts.map((account) => (

                        <Link href={`/accounts/${account.id}`} key={account.id}>
                            <div className="flex flex-row">
                                <p>{account.type.toLocaleUpperCase()} •••• {account.mask} {account.name}</p>
                            </div>

                        </Link>
                    )

                    )}
                </div>
            </div>
        </div>
    );
}