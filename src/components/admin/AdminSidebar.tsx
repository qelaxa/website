"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: Package },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50 lg:hidden"
                onClick={() => setCollapsed(!collapsed)}
            >
                <Menu className="h-5 w-5" />
            </Button>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-40 h-screen bg-slate-900/95 backdrop-blur-xl text-white transition-all duration-300 flex flex-col border-r border-white/5",
                    collapsed ? "w-20" : "w-64",
                    "hidden lg:flex"
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="bg-white rounded-lg p-1.5 shadow-lg shadow-white/5">
                            <Image
                                src="/images/leqaxa_logo_final.jpg"
                                alt="LEQAXA"
                                width={collapsed ? 40 : 120}
                                height={collapsed ? 20 : 60}
                                className={cn(
                                    "object-contain transition-all",
                                    collapsed ? "h-8 w-8" : "h-10 w-auto"
                                )}
                                unoptimized
                            />
                        </div>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white hover:bg-white/5 h-8 w-8 rounded-lg"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <ChevronLeft
                            className={cn(
                                "h-4 w-4 transition-transform duration-300",
                                collapsed && "rotate-180"
                            )}
                        />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-teal-400 to-cyan-400" />
                                )}
                                <item.icon className={cn(
                                    "h-5 w-5 flex-shrink-0 transition-colors",
                                    isActive ? "text-cyan-400" : "text-gray-500 group-hover:text-gray-300"
                                )} />
                                {!collapsed && (
                                    <span className="font-medium">{item.label}</span>
                                )}
                                {isActive && !collapsed && (
                                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile / Logout */}
                <div className="p-4 border-t border-white/5">
                    <div className={cn(
                        "flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 mb-2",
                        collapsed && "justify-center p-2"
                    )}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold shadow-lg">
                            AD
                        </div>
                        {!collapsed && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold truncate">Admin User</p>
                                <p className="text-xs text-gray-500 truncate">admin@leqaxa.com</p>
                            </div>
                        )}
                    </div>

                    <Link
                        href="/"
                        className={cn(
                            "flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors",
                            collapsed && "justify-center px-0"
                        )}
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span className="font-medium">Exit Admin</span>}
                    </Link>
                </div>
            </aside>
        </>
    );
}
