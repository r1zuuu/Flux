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
import { useState } from "react";
import { useTransition } from "react";

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors }} = useForm({
        resolver: zodResolver(LoginSchema),
    });

    const testHandler = (data: any) => {
        console.log("dziala " + data.email + " " + data.password  + " " + JSON.stringify(errors));
    }
    
    return (
        <div className="aurora-bg relative min-h-screen w-full px-4 py-8 sm:px-6">
            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md items-center justify-center">
                <Card className="w-full border-white/10 bg-white/5 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
                    <CardHeader className="space-y-2 text-center">
                        <CardTitle className="text-3xl font-semibold tracking-tight">Sign In</CardTitle>
                        <CardDescription className="mx-auto max-w-sm text-sm text-zinc-300">
                            Enter your credentials to access your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <form onSubmit={handleSubmit(testHandler)}>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col space-y-2">
                                    <p className="text-sm font-medium text-zinc-100">Email</p>
                                    <Input {...register("email")} type="email" placeholder="you@example.com" className="h-11 border-white/15 bg-white/5 text-zinc-100 placeholder:text-zinc-400" />
                                    { errors.email && <p className="text-sm text-red-500">{errors.email.message}</p> }
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <p className="text-sm font-medium text-zinc-100">Password</p>
                                    <Input {...register("password")} type="password" placeholder="••••••••" className="h-11 border-white/15 bg-white/5 text-zinc-100 placeholder:text-zinc-400" />
                                    { errors.password && <p className="text-sm text-red-500">{errors.password.message}</p> }
                                </div>
                            </div>

                            <Button className="h-12 w-full bg-white text-zinc-900 transition-colors hover:bg-zinc-200">Sign In</Button>
                            
                        </form>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/15" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-transparent px-3 text-zinc-400">or</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="h-12 w-full border-white/15 bg-white/5 text-zinc-100 hover:bg-white">
                                <SiGithub className="h-4 w-4" />
                            </Button>

                            <Button variant="outline" className="h-12 w-full border-white/15 bg-white/5 text-zinc-100 hover:bg-white">
                                <SiGoogle className="h-4 w-4" />
                            </Button>
                        </div>

                        <p className="text-center text-sm text-zinc-400">
                            Don&apos;t have an account? <a href="/register" className="font-medium text-zinc-100 hover:text-white hover:underline">Sign up</a>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}