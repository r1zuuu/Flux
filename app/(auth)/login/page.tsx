import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { SiGoogle, SiGithub } from "react-icons/si";

export default async function LoginPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-[450px] bg-card border-border shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Login</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Enter your credentials to access your account or use one of the following providers to sign in.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        
                        <Input type="email" placeholder="Email" />
                        <Input type="password" placeholder="Password" />

                    </div>
                    
                    <Button className="w-full">Sign In</Button>
                    
                    <div className="relative">

                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-card text-muted-foreground">or</span>
                        </div>

                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">

                        <Button variant="outline" className="w-full">
                            <SiGithub className="mr-2 h-4 w-4" />
                            GitHub
                        </Button>

                        <Button variant="outline" className="w-full">
                            <SiGoogle className="mr-2 h-4 w-4" />
                            Google
                        </Button>

                    </div>
                    
                    <p className="text-center text-sm text-muted-foreground">
                        Don't have an account? <a href="/register" className="text-primary hover:underline font-medium">Sign up</a>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}