"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Package, Settings, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
    { href: '/services', label: 'Services' },
    { href: '/preferences', label: 'Care Menu' },
    { href: '/stain-concierge', label: 'Stain Concierge' },
];

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();

    // Handle scroll effect for transparency vs solid background
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-100 shadow-sm transition-all duration-300",
                    scrolled ? "py-2" : "py-3"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 md:h-16">

                        {/* Logo Section - Solid White Background Match - OPTIMIZED SIZE */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="group relative block overflow-hidden">
                                <Image
                                    src="/images/leqaxa_logo_new.png"
                                    alt="LEQAXA"
                                    width={180}
                                    height={80}
                                    className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                    priority
                                    style={{ maxHeight: "80px", width: "auto" }}
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <nav className="flex items-center gap-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-sm font-medium text-gray-600 hover:text-primary transition-colors relative group"
                                    >
                                        {link.label}
                                        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                    </Link>
                                ))}
                            </nav>

                            <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                                {user ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-white">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                                        </button>

                                        {isUserMenuOpen && (
                                            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                                <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 mb-1">
                                                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                </div>

                                                <div className="px-2 space-y-0.5">
                                                    <Link href="/my-bookings" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                                        <Package className="h-4 w-4 text-gray-400" /> My Orders
                                                    </Link>
                                                    <Link href="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                                        <User className="h-4 w-4 text-gray-400" /> Profile
                                                    </Link>
                                                    {user.role === 'admin' && (
                                                        <Link href="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                                            <Settings className="h-4 w-4 text-gray-400" /> Admin
                                                        </Link>
                                                    )}
                                                </div>

                                                <div className="h-px bg-gray-100 my-2 mx-4" />

                                                <div className="px-2">
                                                    <button
                                                        onClick={() => { setIsUserMenuOpen(false); logout(); }}
                                                        className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                                    >
                                                        <LogOut className="h-4 w-4" /> Sign Out
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2">
                                        Sign In
                                    </Link>
                                )}

                                <Button asChild className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 bg-gray-900 hover:bg-gray-800 text-white border-0">
                                    <Link href="/book">
                                        Schedule Pickup
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 -mr-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Spacer */}
            <div className="h-20" />

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsMobileMenuOpen(false)} />

                    {/* Menu Panel */}
                    <div className="absolute inset-y-0 right-0 w-[280px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <span className="font-semibold text-gray-900">Menu</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-md hover:bg-gray-200/50">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-4 flex-1 overflow-y-auto">
                            <div className="space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-between px-4 py-3 text-base font-medium text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                    >
                                        {link.label}
                                        <ChevronRight className="h-4 w-4 text-gray-300" />
                                    </Link>
                                ))}
                            </div>

                            <div className="my-6 border-t border-gray-100" />

                            {user ? (
                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-medium text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Link href="/my-bookings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50">
                                            <Package className="h-5 w-5 text-gray-400" /> My Orders
                                        </Link>
                                        <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50">
                                            <User className="h-5 w-5 text-gray-400" /> Profile
                                        </Link>
                                        <button onClick={() => { setIsMobileMenuOpen(false); logout(); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50">
                                            <LogOut className="h-5 w-5" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                            <Button asChild className="w-full h-12 rounded-xl text-base shadow-lg shadow-primary/20 bg-gray-900 hover:bg-gray-800">
                                <Link href="/book" onClick={() => setIsMobileMenuOpen(false)}>
                                    Schedule Pickup
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
