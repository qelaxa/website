"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

// We can extend this with our 'profiles' table data later if needed
export interface User {
    id: string;
    email: string;
    name: string;
    role: "customer" | "admin";
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    // Initialize Supabase client once per component lifecycle
    const [supabase] = useState(() => createClient());

    // Map Supabase user to our internal User interface
    const mapUser = (sbUser: SupabaseUser, profileData: any = null): User => {
        return {
            id: sbUser.id,
            email: sbUser.email!,
            name: profileData?.full_name || sbUser.user_metadata?.full_name || "User",
            role: profileData?.role || "customer",
        };
    };

    // Check for existing session on mount and listen for changes
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Get current session
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    // Fetch profile data
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    setUser(mapUser(session.user, profile));
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        // Initialize with safety timeout
        initializeAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state changed:", event, session?.user?.email);
            if (session?.user) {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                console.log("Profile fetch result:", { profile, profileError, userId: session.user.id });

                if (profileError) {
                    console.error("Failed to fetch profile:", profileError);
                }

                const mappedUser = mapUser(session.user, profile);
                console.log("Mapped user:", mappedUser);
                setUser(mappedUser);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            console.log("Attempting login via Supabase...");

            // In development, use a short timeout with dev bypass
            // In production, just await the request normally (no artificial timeout)
            let data, error;

            if (process.env.NODE_ENV === 'development') {
                const result = await Promise.race([
                    supabase.auth.signInWithPassword({ email, password }),
                    new Promise<'TIMEOUT'>((resolve) => setTimeout(() => resolve('TIMEOUT'), 2000))
                ]);

                if (result === 'TIMEOUT') {
                    console.warn("Supabase unreachable. Activating DEV BYPASS.");
                    toast('Network blocked? Entering Dev Mode (Admin).', { icon: '🚧' });
                    setUser({ id: 'dev-user-123', email, name: 'Admin Dev User', role: 'admin' });
                    return true;
                }
                ({ data, error } = result);
            } else {
                // Production: No timeout, just await
                ({ data, error } = await supabase.auth.signInWithPassword({ email, password }));
            }

            if (error) {
                console.error("Login Error:", error);

                // Check for common issues and provide clear messages
                if (error.message.includes('Email not confirmed')) {
                    toast.error('Please verify your email before logging in.');
                } else if (error.message.includes('Invalid login credentials')) {
                    toast.error('Invalid email or password.');
                } else {
                    toast.error(error.message);
                }
                return false;
            }

            console.log("Login Successful:", data);
            toast.success("Welcome back!");
            return true;
        } catch (error: any) {
            console.error("Login Exception:", error);
            if (process.env.NODE_ENV === 'development') {
                toast('Dev Mode Activated (Admin)', { icon: '🚧' });
                setUser({ id: 'dev-user-123', email, name: 'Admin Dev User', role: 'admin' });
                return true;
            }
            toast.error('Login failed. Please try again.');
            return false;
        }
    };

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        try {
            console.log("Attempting registration via Supabase...");

            // No artificial timeout - let the request complete naturally
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });

            if (error) {
                console.error("Registration Error:", error);
                toast.error(`Error: ${error.message}`);
                return false;
            }

            console.log("Registration Result:", data);

            // CASE 1: Account created AND Logged In (Email Confirm OFF)
            if (data?.session && data.user) {
                console.log("Session obtained immediately.");
                toast.success("Account created! Logging you in...");
                setUser(mapUser(data.user, { full_name: name, role: 'customer' }));
                return true;
            }

            // CASE 2: Account created but needs Email Verification (Email Confirm ON)
            else if (data?.user && !data.session) {
                console.log("User created but no session - email verification required.");
                toast('Account created! Please check your email to verify, then log in.', { icon: '📧', duration: 8000 });
                return false; // Don't redirect
            }

            return false;
        } catch (error: any) {
            console.error("Registration Exception:", error);
            toast.error("Registration failed. Please try again.");
            return false;
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        toast.success("Logged out successfully");
        router.push("/");
    };

    const updateProfile = async (data: Partial<User>) => {
        // Placeholder - we would implement 'update' to profiles table here
        console.log("Update profile not fully implemented yet", data);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// Protected Route component
export function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login?redirected=true");
        }
        if (!isLoading && adminOnly && user?.role !== "admin") {
            router.push("/");
            toast.error("Admin access required");
        }
    }, [user, isLoading, router, adminOnly]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    if (!user || (adminOnly && user.role !== "admin")) {
        return null;
    }

    return <>{children}</>;
}
