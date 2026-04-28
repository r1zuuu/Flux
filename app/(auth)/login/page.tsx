"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { SiGoogle, SiGithub } from "react-icons/si";
import { login } from "@/app/actions/auth-actions";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginSchema } from "@/app/schemas";
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";


export default function LoginPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: zodResolver(LoginSchema),
    });

    useEffect(() => {
        const redirectLoggedUser = async () => {
            const session = await getSession();

            if (session) {
                router.push("/onboarding");
            }
        };

        redirectLoggedUser();
    }, [router]);

    const onSubmit = (data: z.infer<typeof LoginSchema>) => {
        startTransition(async () => {
            const result = await login(data)
            if (result?.error) {
                setError("email", { message: result.error });
            }
            if (result?.success) {
                const signInResult = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                });

                if (signInResult?.error) {
                    setError("email", { message: "Invalid login credentials" });
                } else {
                    router.push("/onboarding");
                    router.refresh();
                }
            }
        });
    }

    const handleOAuthSignIn = (provider: "github" | "google") => {
        signIn(provider, { callbackUrl: "/onboarding" });
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden flex items-center justify-center z-0">
                <div className="text-[30vw] font-heading font-black text-secondary/40 whitespace-nowrap tracking-tighter opacity-10 uppercase mix-blend-screen">FLUX</div>
            </div>

            <div className="relative z-10 w-full max-w-[440px] group">
                <div className="absolute inset-0 bg-primary translate-x-2 translate-y-2 -z-10 transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3"></div>
                
                <div className="w-full border-2 border-border bg-card p-8 sm:p-10 transition-colors group-hover:border-primary">
                    <div className="space-y-4 text-center mb-10">
                        <div className="w-16 h-16 mx-auto bg-foreground text-background flex items-center justify-center font-heading font-black text-3xl mb-6">
                            F
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter font-heading text-foreground uppercase">ACCESS</h1>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-[0.2em]">
                            Enter secure gateway
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-foreground uppercase tracking-widest block">Identity (Email)</label>
                                <input 
                                    {...register("email")} 
                                    type="email" 
                                    placeholder="OPERATIVE@FLUX.COM" 
                                    className="w-full h-12 px-4 border-2 border-border bg-background text-foreground text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50" 
                                />
                                {errors.email && <p className="text-xs font-bold text-destructive uppercase tracking-wider">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-foreground uppercase tracking-widest block">Passkey</label>
                                <input 
                                    {...register("password")} 
                                    type="password" 
                                    placeholder="••••••••" 
                                    className="w-full h-12 px-4 border-2 border-border bg-background text-foreground text-sm font-bold tracking-widest focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50" 
                                />
                                {errors.password && <p className="text-xs font-bold text-destructive uppercase tracking-wider">{errors.password.message}</p>}
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="w-full h-14 bg-primary text-primary-foreground font-black text-sm uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 border-2 border-transparent hover:border-border" 
                            disabled={isPending}
                        >
                            {isPending ? "AUTHENTICATING..." : "INITIATE SEQUENCE"}
                        </button>
                    </form>

                    <div className="mt-8 mb-8 relative flex items-center justify-center">
                        <div className="absolute w-full border-t-2 border-border"></div>
                        <span className="relative bg-card px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">External Subroutines</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            className="h-12 border-2 border-border bg-background text-foreground hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-3"
                            onClick={() => handleOAuthSignIn("github")}
                            disabled={isPending}
                        >
                            <SiGithub className="text-lg" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Github</span>
                        </button>

                        <button
                            type="button"
                            className="h-12 border-2 border-border bg-background text-foreground hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-3"
                            onClick={() => handleOAuthSignIn("google")}
                            disabled={isPending}
                        >
                            <SiGoogle className="text-lg" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Google</span>
                        </button>
                    </div>

                    <div className="mt-10 text-center">
                        <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">
                            Unregistered? <a href="/register" className="text-primary hover:text-foreground transition-colors ml-2 underline decoration-2 underline-offset-4">Enroll Now</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}