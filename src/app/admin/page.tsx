"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Package, Users, Activity, TrendingUp, Search, MoreHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Input } from "@/components/ui/input";

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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
                </div>
                <div className="flex gap-3">
                    <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg gap-2">
                        <TrendingUp className="h-4 w-4" /> Download Report
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <Badge
                                    variant="outline"
                                    className={stat.trend === "up"
                                        ? "text-emerald-600 bg-emerald-50 border-emerald-100 gap-1"
                                        : "text-red-600 bg-red-50 border-red-100 gap-1"
                                    }
                                >
                                    {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                    {stat.change}
                                </Badge>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                            <p className="text-sm text-gray-500">{stat.title}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Orders */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <CardTitle>Recent Orders</CardTitle>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input placeholder="Search orders..." className="pl-9" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left font-medium text-gray-500 pb-4 pl-4">Order ID</th>
                                    <th className="text-left font-medium text-gray-500 pb-4">Customer</th>
                                    <th className="text-left font-medium text-gray-500 pb-4 hidden md:table-cell">Service</th>
                                    <th className="text-left font-medium text-gray-500 pb-4">Status</th>
                                    <th className="text-right font-medium text-gray-500 pb-4">Total</th>
                                    <th className="pb-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 pl-4 font-mono text-sm font-medium text-gray-900">{order.id}</td>
                                        <td className="py-4 text-gray-900">{order.customer}</td>
                                        <td className="py-4 text-gray-600 hidden md:table-cell">{order.service}</td>
                                        <td className="py-4">
                                            <Badge className={
                                                order.status === 'Completed' || order.status === 'Delivered'
                                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                    : order.status === 'In Progress' || order.status === 'Washing'
                                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                            }>
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4 text-right font-medium text-gray-900">{order.total}</td>
                                        <td className="py-4 text-right pr-4">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
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

