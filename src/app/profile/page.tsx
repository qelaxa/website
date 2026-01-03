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
                <div className="absolute inset-0 gradient-mesh opacity-50" />

                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className="w-full md:w-64 space-y-6">
                            <div className="text-center md:text-left">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto md:mx-0 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg">
                                    GK
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Gabriel Kusi</h2>
                                <p className="text-sm text-gray-500">Member since 2025</p>
                            </div>

                            <nav className="space-y-1">
                                {[
                                    { icon: User, label: "Personal Info", active: true },
                                    { icon: MapPin, label: "Addresses" },
                                    { icon: Bell, label: "Notifications" },
                                    { icon: Shield, label: "Security" },
                                ].map((item) => (
                                    <button
                                        key={item.label}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active
                                                ? 'bg-white shadow-sm text-primary font-medium'
                                                : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                                            }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                    </button>
                                ))}
                                <div className="pt-4 mt-4 border-t border-gray-200">
                                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all">
                                        <LogOut className="h-5 w-5" />
                                        Sign Out
                                    </button>
                                </div>
                            </nav>
                        </aside>

                        {/* Content */}
                        <div className="flex-1 space-y-6">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in-up">
                                <h1 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h1>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <Input id="firstName" defaultValue="Gabriel" className="pl-10 h-12" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <Input id="lastName" defaultValue="Kusi" className="pl-10 h-12" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <Input id="email" defaultValue="gabriel@example.com" className="pl-10 h-12" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <Input id="phone" defaultValue="+1 (555) 000-0000" className="pl-10 h-12" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <Button
                                        className="btn-premium gradient-primary px-8"
                                        onClick={handleSave}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in-up delay-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Default Address</h2>
                                    <Button variant="outline" size="sm">Add New</Button>
                                </div>

                                <div className="border-2 border-primary/20 bg-primary/5 rounded-2xl p-4 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-900">Home</span>
                                            <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">Primary</span>
                                        </div>
                                        <p className="text-gray-600 text-sm">123 University Blvd, Toledo, OH 43606</p>
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
