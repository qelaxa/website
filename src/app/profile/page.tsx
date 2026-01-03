"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Bell, Shield, LogOut } from "lucide-react";

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 py-12 bg-gray-50/50 relative overflow-hidden">
                {/* Ambient Background */}
                <div className="absolute inset-0 gradient-mesh opacity-50" />
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white/80 to-transparent" />

                <div className="container mx-auto px-4 max-w-5xl relative z-10">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className="w-full lg:w-72 space-y-6">
                            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-lg text-center animate-fade-in-up">
                                <div className="relative inline-block">
                                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 mx-auto flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-xl rotate-3 hover:rotate-0 transition-all duration-300 cursor-pointer">
                                        GK
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mt-2">Gabriel Kusi</h2>
                                <p className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full inline-block mt-2">Premium Member</p>
                            </div>

                            <nav className="space-y-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                                {[
                                    { icon: User, label: "Personal Info", active: true },
                                    { icon: MapPin, label: "Addresses" },
                                    { icon: Bell, label: "Notifications" },
                                    { icon: Shield, label: "Security" },
                                ].map((item) => (
                                    <button
                                        key={item.label}
                                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 group ${item.active
                                            ? 'bg-gradient-to-r from-primary to-cyan-500 text-white shadow-lg shadow-primary/25 translate-x-1'
                                            : 'bg-white/60 hover:bg-white text-gray-600 hover:text-primary hover:shadow-md'
                                            }`}
                                    >
                                        <item.icon className={`h-5 w-5 ${item.active ? 'text-white' : 'text-gray-400 group-hover:text-primary'}`} />
                                        <span className="font-medium">{item.label}</span>
                                        {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                    </button>
                                ))}
                                <div className="pt-6 mt-6 border-t border-gray-200/50">
                                    <button className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all font-medium border border-transparent hover:border-red-100">
                                        <LogOut className="h-5 w-5" />
                                        Sign Out
                                    </button>
                                </div>
                            </nav>
                        </aside>

                        {/* Content */}
                        <div className="flex-1 space-y-6">
                            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-elevated-lg border border-white/50 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
                                        <p className="text-gray-500 text-sm mt-1">Manage your personal details and preferences</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="hidden sm:flex rounded-full border-gray-200 hover:border-primary hover:text-primary">
                                        Edit Details
                                    </Button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">First Name</Label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                                            <Input
                                                id="firstName"
                                                defaultValue="Gabriel"
                                                className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">Last Name</Label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                                            <Input
                                                id="lastName"
                                                defaultValue="Kusi"
                                                className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                                            <Input
                                                id="email"
                                                defaultValue="gabriel@example.com"
                                                className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number</Label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                                            <Input
                                                id="phone"
                                                defaultValue="+1 (555) 000-0000"
                                                className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end pt-6 border-t border-gray-100">
                                    <Button
                                        className="h-11 px-8 btn-premium gradient-primary shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                        onClick={handleSave}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Saving changes..." : "Save Changes"}
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/50 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Default Address</h2>
                                        <p className="text-gray-500 text-sm mt-1">Your primary delivery location</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="rounded-full border-gray-200 hover:border-primary hover:text-primary text-gray-600">
                                        Manage Addresses
                                    </Button>
                                </div>

                                <div className="group border-2 border-primary/10 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl p-5 flex items-start gap-5 hover:border-primary/30 transition-all cursor-pointer">
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-bold text-gray-900 text-lg">Home</span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded-full">Primary</span>
                                        </div>
                                        <p className="text-gray-600 mb-1">123 University Blvd</p>
                                        <p className="text-gray-500 text-sm">Toledo, OH 43606</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
