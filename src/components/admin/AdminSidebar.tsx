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
                    "fixed left-0 top-0 z-40 h-screen bg-gray-900 text-white transition-all duration-300 flex flex-col",
                    collapsed ? "w-20" : "w-64",
                    "hidden lg:flex"
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="bg-white rounded-lg p-1.5">
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
                        className="text-gray-400 hover:text-white hover:bg-gray-800"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <ChevronLeft
                            className={cn(
                                "h-5 w-5 transition-transform",
                                collapsed && "rotate-180"
                            )}
                        />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                    isActive
                                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                                )}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {!collapsed && (
                                    <span className="font-medium">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-800">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span className="font-medium">Exit Admin</span>}
                    </Link>
                </div>
            </aside>
        </>
    );
}
