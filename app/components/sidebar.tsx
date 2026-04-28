'use client'
import PlaceholderPfp from '@/public/pfp-placeholder.jpg'
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SidebarProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export default function Sidebar({ user }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const routes = [
        { label: "Overview", href: "/dashboard" },
        { label: "Transactions", href: "/transactions" },
        { label: "Settings", href: "/settings" },
    ];

    const handleLogout = () => {
        signOut();
        router.push('/login');
    }

    return (
        <aside className="hidden min-h-[100dvh] w-[272px] shrink-0 border-r border-border bg-card px-7 py-8 font-sans lg:flex lg:flex-col lg:justify-between">
            <div className="flex flex-col gap-12">
                <div className="border-b border-border pb-7">
                    <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center border border-primary bg-background font-serif text-xl text-primary">
                        F
                    </div>
                    <div className="flex flex-col">
                        <span className="font-serif text-2xl leading-none text-foreground">Flux</span>
                        <span className="mt-1 text-[0.6rem] uppercase tracking-[0.26em] text-muted-foreground">Private Office</span>
                    </div>
                    </div>
                </div>

                <nav className="flex flex-col gap-1">
                    <span className="mb-3 text-[0.65rem] font-medium uppercase tracking-[0.24em] text-muted-foreground">Menu</span>
                    {routes.map((route) => {
                        const isActive = pathname === route.href;
                        return (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={`group border-l py-3 pl-4 pr-2 text-sm transition-colors duration-200
                                    ${isActive 
                                        ? "border-primary font-medium text-primary" 
                                        : "border-transparent text-muted-foreground hover:border-accent hover:text-foreground"
                                    }`}
                            >
                                {route.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="flex flex-col gap-6">
                <div className="h-px w-full bg-border" />
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <Image 
                            src={user?.image || PlaceholderPfp} 
                            alt="Profile" 
                            width={40} 
                            height={40} 
                            className="h-10 w-10 rounded-sm border border-border object-cover grayscale" 
                        />
                        <div className="flex flex-col">
                            <span className="font-serif text-base leading-tight text-foreground">{user?.name || "Account holder"}</span>
                            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">Managed access</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-fit border-b border-transparent pb-1 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                        title="Logout"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </aside>
    );
}
