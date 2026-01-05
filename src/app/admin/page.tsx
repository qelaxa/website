"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Package, Users, Activity, TrendingUp, Search, MoreHorizontal, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from 'next/link';

import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
// ... imports

// ... stats array (we will update values dynamically)

export default function AdminDashboard() {
    const supabase = createClient();
    const [statsData, setStatsData] = useState({
        revenue: 0,
        activeOrders: 0,
        newCustomers: 0,
        avgTurnaround: "24h" // Placeholder for now
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                // 1. Fetch Orders for Revenue & Active Count & Recent List
                const { data: orders, error: ordersError } = await supabase
                    .from('orders')
                    .select('*, profiles(full_name)')
                    .order('created_at', { ascending: false });

                if (ordersError) throw ordersError;

                // 2. Fetch Customers Count
                const { count: customerCount, error: profileError } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                if (profileError) throw profileError;

                // Calculate Stats
                const totalRevenue = (orders || []).reduce((sum, order) => sum + (order.total_amount || 0), 0);
                const activeCount = (orders || []).filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;

                setStatsData({
                    revenue: totalRevenue,
                    activeOrders: activeCount,
                    newCustomers: customerCount || 0,
                    avgTurnaround: "20h" // Hardcoded for now
                });

                // Map Recent Orders (Top 5)
                const recent = (orders || []).slice(0, 5).map(o => ({
                    id: o.id,
                    customer: o.profiles?.full_name || 'Guest',
                    service: o.items?.[0]?.name || 'Service',
                    status: o.status,
                    total: `$${(o.total_amount || 0).toFixed(2)}`
                }));
                setRecentOrders(recent);

            } catch (error) {
                console.error("Dashboard data fetch error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    const stats = [
        { title: "Total Revenue", value: `$${statsData.revenue.toLocaleString()}`, change: "+12.5%", trend: "up", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { title: "Active Orders", value: statsData.activeOrders.toString(), change: "+4", trend: "up", icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Total Customers", value: statsData.newCustomers.toString(), change: "+22.4%", trend: "up", icon: Users, color: "text-violet-500", bg: "bg-violet-500/10" },
        { title: "Avg. Turnaround", value: statsData.avgTurnaround, change: "-2h", trend: "down", icon: Activity, color: "text-orange-500", bg: "bg-orange-500/10" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* ... rest of the JSX using `stats` and `recentOrders` variables ... */}
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                {/* ... */}
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={stat.title} className="glass-card border-0 shadow-sm hover:shadow-elevated-lg transition-all duration-300 group overflow-hidden" style={{ animationDelay: `${i * 100}ms` }}>
                        <CardContent className="p-6 relative">
                            {/* ... card content same as before but using dynamic stat values ... */}
                            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                                <stat.icon className={`h-24 w-24 ${stat.color}`} />
                            </div>
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                {/* Trend Badge - keeping hardcoded for MVP */}
                                <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-100 gap-1 px-2.5 py-1">
                                    <ArrowUpRight className="h-3 w-3" />
                                    {stat.change}
                                </Badge>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{stat.value}</h3>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Orders */}
            <Card className="border-0 shadow-elevated-lg glass-card overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-6 py-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <CardTitle className="text-xl font-bold text-gray-900">Recent Orders</CardTitle>
                        <Button variant="ghost" asChild className="text-primary hover:text-primary-hover hover:bg-primary/5">
                            <Link href="/admin/orders">View All</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/30">
                                    <th className="text-left font-semibold text-gray-600 py-4 pl-6">Order ID</th>
                                    <th className="text-left font-semibold text-gray-600 py-4">Customer</th>
                                    <th className="text-left font-semibold text-gray-600 py-4 hidden md:table-cell">Service</th>
                                    <th className="text-left font-semibold text-gray-600 py-4">Status</th>
                                    <th className="text-right font-semibold text-gray-600 py-4 pr-6">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-gray-500">No recent orders</td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors group">
                                            <td className="py-4 pl-6 font-mono text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{order.id.slice(0, 8)}...</td>
                                            <td className="py-4 font-medium text-gray-900">{order.customer}</td>
                                            <td className="py-4 text-gray-500 hidden md:table-cell">{order.service}</td>
                                            <td className="py-4">
                                                <Badge className={
                                                    order.status === 'Completed' || order.status === 'Delivered'
                                                        ? 'bg-emerald-100 text-emerald-700 border-none px-3'
                                                        : order.status === 'Cancelled'
                                                            ? 'bg-red-100 text-red-700 border-none px-3'
                                                            : 'bg-blue-100 text-blue-700 border-none px-3'
                                                }>
                                                    {order.status}
                                                </Badge>
                                            </td>
                                            <td className="py-4 text-right font-bold text-gray-900 pr-6">{order.total}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

