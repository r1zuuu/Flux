'use client'
import { MdDashboard } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import PlaceholderPfp from '@/public/pfp-placeholder.jpg'
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
interface SidebarProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export default function Sidebar({ user }: SidebarProps) {
    const routes = [
        { label: "Dashboard", icon: MdDashboard, href: "/dashboard" },
        { label: "Transactions", icon: GrTransaction, href: "/transactions" },
        { label: "Settings", icon: IoSettingsOutline, href: "/settings" },
    ];
    const pathname = usePathname();

    return (
        <div className="w-64 h-screen bg-background p-4">
            <div className="flex flex-col text-black gap-8 justify-center">
                <div className="flex flex-row gap-2 items-center text-white ">
                    <Image src={user?.image || PlaceholderPfp} alt="Profile" width={40} height={40} className="w-10 h-10 rounded-full" />
                    <h1 className="font-bold">{user?.name}</h1>
                </div>
                <hr />
                <div className="flex flex-col gap-4">
                    {
                        routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={`flex flex-row gap-2 items-center py-4 px-3 rounded-lg transition-all ${pathname === route.href ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"}`}>
                                <route.icon />
                                {route.label}

                            </Link>
                        )
                        )
                    }
                </div>
                <hr />
            </div>
        </div >
    );
}   