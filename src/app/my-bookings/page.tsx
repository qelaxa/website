"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shirt, Calendar, Clock, ChevronRight, Truck, Sparkles, Loader2, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Order {
    id: string;
    customer: string;
    email: string;
    service: string;
    status: string;
    total: string;
    date: string;
    time: string;
}

export default function MyBookingsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch("/api/orders");
                const allOrders = await res.json();
                // Filter orders for current user
                const userOrders = allOrders.filter(
                    (order: Order) => order.email?.toLowerCase() === user.email.toLowerCase()
                );
                setOrders(userOrders);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        }

        if (!authLoading) {
            fetchOrders();
        }
    }, [user, authLoading]);

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { class: string; icon: React.ReactNode; label: string }> = {
            "Confirmed": { class: "bg-blue-100 text-blue-700", icon: <Package className="h-3 w-3" />, label: "Confirmed" },
            "Picked Up": { class: "bg-purple-100 text-purple-700", icon: <Truck className="h-3 w-3" />, label: "Picked Up" },
            "Washing": { class: "bg-cyan-100 text-cyan-700", icon: <Sparkles className="h-3 w-3 animate-pulse" />, label: "Washing" },
            "In Progress": { class: "bg-amber-100 text-amber-700", icon: <Loader2 className="h-3 w-3 animate-spin" />, label: "In Progress" },
            "Out for Delivery": { class: "bg-orange-100 text-orange-700", icon: <Truck className="h-3 w-3 animate-pulse" />, label: "Out for Delivery" },
            "Delivered": { class: "bg-emerald-100 text-emerald-700", icon: <Sparkles className="h-3 w-3" />, label: "Delivered" },
            "Completed": { class: "bg-emerald-100 text-emerald-700", icon: <Sparkles className="h-3 w-3" />, label: "Completed" },
        };
        const config = statusMap[status] || { class: "bg-gray-100 text-gray-700", icon: null, label: status };
        return (
            <Badge className={config.class}>
                <span className="flex items-center gap-1.5">{config.icon} {config.label}</span>
            </Badge>
        );
    };

    if (authLoading || loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
                </main>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 flex items-center justify-center py-12">
                    <Card className="max-w-md text-center border-0 shadow-xl">
                        <CardContent className="pt-8 pb-6">
                            <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to view orders</h2>
                            <p className="text-gray-500 mb-6">Log in to see your order history and track current orders.</p>
                            <Button asChild className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                                <Link href="/login">Sign In</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 py-12 bg-gray-50/50 relative overflow-hidden">
                <div className="absolute inset-0 gradient-mesh opacity-50" />

                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <div className="flex items-center justify-between mb-8 animate-fade-in-up">
                        <div>
                            <h1 className="heading-lg text-gray-900 mb-2">My Orders</h1>
                            <p className="text-gray-600">Track current orders and view history</p>
                        </div>
                        <Button asChild className="btn-premium gradient-primary shadow-lg">
                            <Link href="/book">Schedule Pickup</Link>
                        </Button>
                    </div>

                    {orders.length === 0 ? (
                        <Card className="border-0 shadow-sm text-center py-12">
                            <CardContent>
                                <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
                                <p className="text-gray-500 mb-6">Schedule your first pickup to get started!</p>
                                <Button asChild className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                                    <Link href="/book">Schedule Pickup</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order, i) => (
                                <Card key={order.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-elevated-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Status Strip */}
                                            <div className={`w-full md:w-2 h-2 md:h-auto ${order.status === 'Completed' || order.status === 'Delivered'
                                                    ? 'bg-emerald-500'
                                                    : 'bg-gradient-to-b from-blue-500 to-cyan-500'
                                                }`} />

                                            <div className="p-6 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="font-mono text-sm font-bold text-gray-500">#{order.id}</span>
                                                        {getStatusBadge(order.status)}
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                        <Shirt className="h-4 w-4 text-primary" />
                                                        {order.service}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {order.date}</span>
                                                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {order.time}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between md:justify-end gap-6">
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500 mb-1">Total</p>
                                                        <p className="text-xl font-bold text-gray-900">{order.total}</p>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                                                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
