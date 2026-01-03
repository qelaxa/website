"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Package, Users, Activity, TrendingUp, Search, MoreHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from 'next/link';

const stats = [
    { title: "Total Revenue", value: "$12,450", change: "+12.5%", trend: "up", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Active Orders", value: "24", change: "+4", trend: "up", icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "New Customers", value: "156", change: "+22.4%", trend: "up", icon: Users, color: "text-violet-500", bg: "bg-violet-500/10" },
    { title: "Avg. Turnaround", value: "20h", change: "-2h", trend: "down", icon: Activity, color: "text-orange-500", bg: "bg-orange-500/10" },
];

const recentOrders = [
    { id: "LQ-2849", customer: "Sarah Johnson", service: "Wash & Fold (25lbs)", status: "In Progress", total: "$55.00" },
    { id: "LQ-2848", customer: "Mike Chen", service: "Student Special", status: "Picked Up", total: "$25.00" },
    { id: "LQ-2847", customer: "Emily Davis", service: "Comforter (King)", status: "Delivered", total: "$25.00" },
    { id: "LQ-2846", customer: "James Wilson", service: "Wash & Fold (40lbs)", status: "Washing", total: "$80.00" },
    { id: "LQ-2845", customer: "Jessica Brown", service: "Dry Cleaning (3)", status: "Completed", total: "$45.00" },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
                </div>
                <div className="flex gap-3">
                    <Button className="btn-premium gradient-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl transition-all">
                        <TrendingUp className="h-4 w-4 mr-2" /> Download Report
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={stat.title} className="glass-card border-0 shadow-sm hover:shadow-elevated-lg transition-all duration-300 group overflow-hidden" style={{ animationDelay: `${i * 100}ms` }}>
                        <CardContent className="p-6 relative">
                            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                                <stat.icon className={`h-24 w-24 ${stat.color}`} />
                            </div>
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <Badge
                                    variant="outline"
                                    className={stat.trend === "up"
                                        ? "text-emerald-600 bg-emerald-50 border-emerald-100 gap-1 px-2.5 py-1"
                                        : "text-red-600 bg-red-50 border-red-100 gap-1 px-2.5 py-1"
                                    }
                                >
                                    {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
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
                        <div className="relative w-full sm:w-72 group">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                            <Input
                                placeholder="Search by Order ID or Name..."
                                className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all bg-white"
                            />
                        </div>
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
                                    <th className="text-right font-semibold text-gray-600 py-4">Total</th>
                                    <th className="py-4 pr-6"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors group">
                                        <td className="py-4 pl-6 font-mono text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{order.id}</td>
                                        <td className="py-4">
                                            <div className="font-medium text-gray-900">{order.customer}</div>
                                        </td>
                                        <td className="py-4 text-gray-500 hidden md:table-cell">{order.service}</td>
                                        <td className="py-4">
                                            <Badge className={
                                                order.status === 'Completed' || order.status === 'Delivered'
                                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-3'
                                                    : order.status === 'In Progress' || order.status === 'Washing'
                                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3'
                                                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-none px-3'
                                            }>
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4 text-right font-bold text-gray-900">{order.total}</td>
                                        <td className="py-4 text-right pr-6">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 text-gray-400 hover:text-gray-900" asChild>
                                                <Link href={`/admin/orders/${order.id}`}>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

