import Sidebar from "../components/sidebar"
import { auth } from "@/app/auth";
export default async function DashboardLayout({

  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <Sidebar user={session?.user} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}