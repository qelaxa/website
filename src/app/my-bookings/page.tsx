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

import { createClient } from "@/lib/supabase";

export default function MyBookingsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchOrders() {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error("Supabase error:", error);
                    return;
                }

                if (data) {
                    const mappedOrders: Order[] = data.map(order => {
                        // formats date/time from postgres timestamp
                        const dateObj = new Date(order.pickup_date || order.created_at);
                        return {
                            id: order.id.slice(0, 8), // Short ID for display
                            customer: user.name,
                            email: user.email,
                            service: order.items && Array.isArray(order.items) && order.items.length > 0
                                ? order.items[0].name || "Laundry Service"
                                : "Standard Wash & Fold",
                            status: order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' '),
                            total: `$${Number(order.total_amount).toFixed(2)}`,
                            date: dateObj.toLocaleDateString(),
                            time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        };
                    });
                    setOrders(mappedOrders);
                }
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
                {/* Ambient Background */}
                <div className="absolute inset-0 gradient-mesh opacity-50" />
                <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in-up">
                        <div>
                            <h1 className="heading-lg text-gray-900 mb-2">My Orders</h1>
                            <p className="text-gray-600">Track current orders and view history</p>
                        </div>
                        <Button asChild className="btn-premium gradient-primary shadow-lg hover:shadow-xl transition-all group">
                            <Link href="/book">
                                Schedule Pickup
                                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>

                    {orders.length === 0 ? (
                        <Card className="glass-card border-0 shadow-elevated-lg text-center py-16 animate-fade-in-up delay-100">
                            <CardContent className="flex flex-col items-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <Package className="h-10 w-10 text-gray-300" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">No orders yet</h2>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    Your laundry journey starts here. Schedule your first pickup to experience premium care tailored to you.
                                </p>
                                <Button asChild className="h-12 px-8 btn-premium gradient-primary text-white text-lg shadow-lg hover:shadow-xl transition-all">
                                    <Link href="/book">Start Your First Order</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order, i) => (
                                <Card key={order.id} className="group glass-card border-0 shadow-sm hover:shadow-elevated-lg transition-all duration-300 animate-fade-in-up overflow-hidden" style={{ animationDelay: `${i * 100}ms` }}>
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Status Strip */}
                                            <div className={`w-full md:w-2 h-2 md:h-auto ${order.status === 'Completed' || order.status === 'Delivered'
                                                ? 'bg-gradient-to-b from-emerald-400 to-emerald-600'
                                                : 'bg-gradient-to-b from-blue-400 to-cyan-500'
                                                }`} />

                                            <div className="p-6 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-mono text-sm font-bold text-gray-400">#{order.id}</span>
                                                        {getStatusBadge(order.status)}
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                            <Shirt className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold text-gray-900 leading-none mb-1">{order.service}</h3>
                                                            <p className="text-xs text-gray-500">Premium Care</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-6 text-sm text-gray-500 pt-2">
                                                        <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                            <Calendar className="h-3.5 w-3.5 text-gray-400" /> {order.date}
                                                        </span>
                                                        <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                            <Clock className="h-3.5 w-3.5 text-gray-400" /> {order.time}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                                                    <div className="text-right">
                                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total</p>
                                                        <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">{order.total}</p>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/5 hover:text-primary transition-colors">
                                                        <ChevronRight className="h-5 w-5" />
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
