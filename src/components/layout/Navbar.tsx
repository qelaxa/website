"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Package, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
    { href: '/services', label: 'Services' },
    { href: '/preferences', label: 'Care Menu' },
    { href: '/stain-concierge', label: 'Stain Help' },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-sm",
                isScrolled ? "py-2" : "py-4"
            )}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                            <Image
                                src="/images/leqaxa_logo_new.png"
                                alt="LEQAXA"
                                width={140}
                                height={56}
                                className="h-8 w-auto max-w-[120px] md:h-12 md:max-w-[160px] object-contain"
                                priority
                                unoptimized
                                quality={100}
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group",
                                        isScrolled
                                            ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                                            : "text-gray-700 hover:text-gray-900 hover:bg-white/50"
                                    )}
                                >
                                    {link.label}
                                    <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                                </Link>
                            ))}

                            <div className="w-px h-6 bg-gray-200 mx-2" />

                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                            <Link
                                                href="/my-bookings"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <Package className="h-4 w-4" /> My Orders
                                            </Link>
                                            <Link
                                                href="/profile"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <User className="h-4 w-4" /> Profile
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    <Settings className="h-4 w-4" /> Admin Panel
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                    logout();
                                                }}
                                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="h-4 w-4" /> Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className={cn(
                                        "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                                        isScrolled
                                            ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                                            : "text-gray-700 hover:text-gray-900 hover:bg-white/50"
                                    )}
                                >
                                    Log In
                                </Link>
                            )}

                            <Button asChild className="ml-2 btn-premium gradient-primary border-0 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300">
                                <Link href="/book">Schedule Pickup</Link>
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={cn(
                                "md:hidden p-2 rounded-lg transition-colors",
                                isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-gray-800 hover:bg-white/50"
                            )}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 z-40 md:hidden transition-all duration-300",
                isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Menu Panel */}
                <div className={cn(
                    "absolute top-0 right-0 h-full w-72 bg-slate-900/95 backdrop-blur-lg pt-16 px-6 pb-6 transform transition-transform duration-300 ease-out overflow-y-auto",
                    isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}>
                    <div className="flex flex-col gap-2 mt-4">
                        {user && (
                            <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-white/10 rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-semibold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-white font-medium">{user.name}</p>
                                    <p className="text-white/60 text-xs">{user.email}</p>
                                </div>
                            </div>
                        )}

                        {navLinks.map((link, index) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-4 py-3 text-white/90 font-medium rounded-lg hover:bg-white/10 transition-colors animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="h-px bg-white/10 my-2" />

                        {user ? (
                            <>
                                <Link
                                    href="/my-bookings"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-3 text-white/90 font-medium rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    My Orders
                                </Link>
                                <Link
                                    href="/profile"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-3 text-white/90 font-medium rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    Profile
                                </Link>
                                {user.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="px-4 py-3 text-white/90 font-medium rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        logout();
                                    }}
                                    className="px-4 py-3 text-red-400 font-medium rounded-lg hover:bg-white/10 transition-colors text-left"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-4 py-3 text-white/90 font-medium rounded-lg hover:bg-white/10 transition-colors"
                            >
                                Log In
                            </Link>
                        )}

                        <Button
                            asChild
                            className="mt-4 w-full gradient-primary border-0 shadow-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Link href="/book">Schedule Pickup</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Spacer for fixed navbar */}
            <div className="h-16" />
        </>
    );
}
