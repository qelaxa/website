"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { login, user } = useAuth();
    const router = useRouter();

    // Auto-redirect if user becomes logged in (handles async auth state updates)
    useEffect(() => {
        console.log("Login page - user state:", user?.email);
        if (user) {
            console.log("User detected, redirecting to /my-bookings");
            router.push("/my-bookings");
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        console.log("Login form submitted, calling login()...");

        try {
            const success = await login(email, password);
            console.log("Login returned:", success);

            if (success) {
                console.log("Login successful, pushing to /my-bookings...");
                router.push("/my-bookings");
                console.log("router.push called");
            } else {
                console.log("Login returned false");
            }
        } catch (err) {
            console.error("handleSubmit error:", err);
        } finally {
            console.log("Setting isLoading to false");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 flex items-center justify-center py-20 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 gradient-mesh" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 pattern-grid opacity-30" />

                <div className="w-full max-w-md px-4 relative z-10 animate-fade-in-up">
                    <Card className="glass-card border-0 shadow-elevated-lg overflow-hidden">
                        <div className="h-1 gradient-primary" />
                        <CardHeader className="text-center pt-8 pb-4">
                            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center mb-4 shadow-lg">
                                <Lock className="h-7 w-7 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                                Welcome Back
                            </CardTitle>
                            <CardDescription className="text-base text-gray-500">
                                Sign in to manage your laundry
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-8">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {error && (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm animate-fade-in">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            className="pl-10 h-11 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                                        <Link href="#" className="text-xs font-medium text-primary hover:text-primary-hover hover:underline">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 h-11 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 btn-premium gradient-primary text-white text-base shadow-lg hover:shadow-xl transition-all"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            Sign In <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-500">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/register" className="text-primary font-bold hover:underline transition-all">
                                        Create one
                                    </Link>
                                </p>
                            </div>


                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}
