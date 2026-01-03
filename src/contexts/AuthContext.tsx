"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    address?: string;
    role: "customer" | "admin";
    createdAt: string;
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

    // Check for existing session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("leqaxa_user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem("leqaxa_user");
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok && data.user) {
                setUser(data.user);
                localStorage.setItem("leqaxa_user", JSON.stringify(data.user));
                toast.success("Welcome back!");
                return true;
            } else {
                toast.error(data.error || "Invalid credentials");
                return false;
            }
        } catch (error) {
            toast.error("Login failed. Please try again.");
            return false;
        }
    };

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok && data.user) {
                setUser(data.user);
                localStorage.setItem("leqaxa_user", JSON.stringify(data.user));
                toast.success("Account created successfully!");
                return true;
            } else {
                toast.error(data.error || "Registration failed");
                return false;
            }
        } catch (error) {
            toast.error("Registration failed. Please try again.");
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("leqaxa_user");
        toast.success("Logged out successfully");
        router.push("/");
    };

    const updateProfile = (data: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...data };
            setUser(updatedUser);
            localStorage.setItem("leqaxa_user", JSON.stringify(updatedUser));
            toast.success("Profile updated!");
        }
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
            router.push("/login");
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
