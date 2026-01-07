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
    // Priority for role: user_metadata.role > profileData.role > 'customer'
    const mapUser = (sbUser: SupabaseUser, profileData: any = null): User => {
        // Check user_metadata first (this is in the JWT, no DB query needed)
        const metadataRole = sbUser.user_metadata?.role;
        const profileRole = profileData?.role;

        // Use metadata role if present, otherwise profile role, otherwise default
        const role = metadataRole || profileRole || 'customer';

        console.log("mapUser - metadata role:", metadataRole, "profile role:", profileRole, "using:", role);

        return {
            id: sbUser.id,
            email: sbUser.email!,
            name: profileData?.full_name || sbUser.user_metadata?.full_name || "User",
            role: role,
        };
    };

    // Check for existing session on mount and listen for changes
    useEffect(() => {
        console.log("Auth useEffect starting...");
        let sessionHandled = false;

        // Get session and set user immediately (role from user_metadata, no DB needed)
        const tryGetSession = async () => {
            try {
                const sessionPromise = supabase.auth.getSession();
                const timeoutPromise = new Promise<'TIMEOUT'>((resolve) =>
                    setTimeout(() => resolve('TIMEOUT'), 3000)
                );

                const result = await Promise.race([sessionPromise, timeoutPromise]);

                if (result === 'TIMEOUT') {
                    console.log("getSession timed out after 3s");
                    return;
                }

                const { data: { session } } = result;
                console.log("getSession result:", session?.user?.email || "No session");

                if (!sessionHandled && session?.user) {
                    sessionHandled = true;

                    // IMMEDIATELY set user from session (role comes from user_metadata)
                    // No need to wait for profile fetch
                    setUser(mapUser(session.user, null));
                    setIsLoading(false);
                    console.log("User set immediately from session metadata");

                    // Background: try to fetch profile for additional data (non-blocking)
                    (async () => {
                        try {
                            const { data: profile, error } = await supabase
                                .from('profiles').select('*').eq('id', session.user.id).single();
                            if (profile && !error) {
                                console.log("Background profile fetch succeeded:", profile);
                                setUser(mapUser(session.user, profile));
                            }
                        } catch (e) {
                            console.log("Background profile fetch failed:", e);
                        }
                    })();
                } else if (!sessionHandled) {
                    sessionHandled = true;
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("getSession error:", error);
            }
        };

        tryGetSession();

        // Fallback timeout - if nothing works in 5s, assume no session
        const fallbackTimeout = setTimeout(() => {
            if (!sessionHandled) {
                console.log("Fallback timeout - no session, setting isLoading false");
                sessionHandled = true;
                setIsLoading(false);
            }
        }, 20000);

        // Listen for auth changes (for login/logout during app usage)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            clearTimeout(fallbackTimeout);
            console.log("Auth state changed:", event, session?.user?.email);

            // FORCED REDIRECT on login from auth pages
            if (event === 'SIGNED_IN' && session?.user && typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                console.log("SIGNED_IN detected, current path:", currentPath);
                if (currentPath === '/login' || currentPath === '/register') {
                    console.log("Forcing redirect to /my-bookings via window.location NOW");
                    window.location.replace('/my-bookings');
                    return;
                }
            }

            // Skip if already handled by getSession
            if (sessionHandled && event === 'INITIAL_SESSION') {
                console.log("Session already handled by getSession, skipping INITIAL_SESSION");
                return;
            }

            sessionHandled = true;

            if (session?.user) {
                // IMMEDIATELY set user from session metadata (no blocking)
                setUser(mapUser(session.user, null));
                setIsLoading(false);
                console.log("User set from onAuthStateChange (using metadata)");

                // Background profile fetch (non-blocking)
                (async () => {
                    try {
                        const { data: profile, error } = await supabase
                            .from('profiles').select('*').eq('id', session.user.id).single();
                        if (profile && !error) {
                            console.log("Background profile fetch succeeded:", profile);
                            setUser(mapUser(session.user, profile));
                        }
                    } catch (e) {
                        console.log("Background profile fetch failed:", e);
                    }
                })();
            } else {
                setUser(null);
                setIsLoading(false);
            }
            console.log("Auth loading complete");
        });

        return () => {
            clearTimeout(fallbackTimeout);
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

            // Use a 10s timeout for registration
            const timeoutPromise = new Promise<'TIMEOUT'>((resolve) =>
                setTimeout(() => resolve('TIMEOUT'), 10000)
            );

            const signUpPromise = supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        role: 'customer', // Store role in metadata
                    },
                },
            });

            const result = await Promise.race([signUpPromise, timeoutPromise]);

            // Handle timeout
            if (result === 'TIMEOUT') {
                console.warn("Registration request timed out after 10s");
                toast('Registration is taking longer than expected. Your account may have been created. Please try to log in or check your email.', {
                    icon: '⏳',
                    duration: 8000
                });
                return false;
            }

            const { data, error } = result;

            if (error) {
                console.error("Registration Error:", error);
                // Handle specific error cases
                if (error.message.includes('already registered')) {
                    toast.error("This email is already registered. Please sign in instead.");
                } else {
                    toast.error(`Registration failed: ${error.message}`);
                }
                return false;
            }

            console.log("Registration Result:", data);

            // CASE 1: Account created AND Logged In (Email Confirm OFF)
            if (data?.session && data.user) {
                console.log("Session obtained immediately - email confirmation is OFF");
                toast.success("Account created! Welcome to LEQAXA!");
                // User will be set by onAuthStateChange
                return true;
            }

            // CASE 2: Account created but needs Email Verification (Email Confirm ON)
            if (data?.user && !data.session) {
                console.log("User created but no session - email verification may be required");
                toast.success("Account created! Please check your email to verify, then log in.", {
                    icon: '📧',
                    duration: 10000
                });
                return true; // Registration was successful
            }

            // CASE 3: User already exists (sometimes returns without error)
            if (data?.user && data.user.identities && data.user.identities.length === 0) {
                console.log("User already exists");
                toast.error("This email is already registered. Please sign in instead.");
                return false;
            }

            return false;
        } catch (error: any) {
            console.error("Registration Exception:", error);
            toast.error("Registration failed. Please check your connection and try again.");
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
