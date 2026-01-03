"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Mock Data
const MOCK_CUSTOMER = {
    id: "cust_01",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(419) 555-0123",
    address: "123 Maple Ave, Toledo, OH 43606",
    notes: "Prefers texts over calls. Gate code #1234.",
    joinedDate: "2023-01-15",
    totalOrders: 12,
    totalSpend: 450.50,
    status: "Active",
    orders: [
        { id: "LQ-2849", date: "2023-10-24", service: "Wash & Fold", total: 55.00, status: "In Progress" },
        { id: "LQ-2810", date: "2023-10-10", service: "Dry Cleaning", total: 42.50, status: "Completed" },
        { id: "LQ-2755", date: "2023-09-28", service: "Student Special", total: 25.00, status: "Completed" },
        { id: "LQ-2701", date: "2023-09-14", service: "Wash & Fold", total: 60.00, status: "Completed" },
    ]
};

export default function CustomerDetailsPage() {
    const router = useRouter();
    const params = useParams();

    // In a real app, fetch customer by params.id
    const customer = MOCK_CUSTOMER;

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()} className="h-10 w-10">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                        <p className="text-gray-500 text-sm">Customer Profile • ID: {params.id}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                        Block User
                    </Button>
                    <Button className="btn-premium gradient-primary">
                        Edit Profile
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column: Info Cards */}
                <div className="space-y-6">
                    {/* Contact Info */}
                    <Card className="border-0 shadow-sm glass-card">
                        <CardHeader>
                            <CardTitle className="text-lg">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-medium text-gray-900 truncate">{customer.email}</p>
                                    <p className="text-xs text-gray-500">Email</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{customer.phone}</p>
                                    <p className="text-xs text-gray-500">Phone</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{customer.address}</p>
                                    <p className="text-xs text-gray-500">Address</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Member since {customer.joinedDate}</p>
                                    <p className="text-xs text-gray-500">Joined</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <Card className="border-0 shadow-sm glass-card bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        <CardHeader>
                            <CardTitle className="text-lg text-white/90">Lifetime Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <ShoppingBag className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="font-medium text-white/80">Total Orders</span>
                                </div>
                                <span className="text-2xl font-bold">{customer.totalOrders}</span>
                            </div>
                            <Separator className="bg-white/20" />
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <DollarSign className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="font-medium text-white/80">Total Spend</span>
                                </div>
                                <span className="text-2xl font-bold">${customer.totalSpend.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Order History */}
                <div className="lg:col-span-2">
                    <Card className="border-0 shadow-sm glass-card h-full">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle>Order History</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <th className="px-6 py-4">Order ID</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Service</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {customer.orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-primary">#{order.id}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{order.service}</td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className={
                                                        order.status === 'Completed' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                                                            order.status === 'In Progress' ? 'text-blue-600 bg-blue-50 border-blue-100' :
                                                                'text-gray-600 bg-gray-50'
                                                    }>
                                                        {order.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium text-gray-900">
                                                    ${order.total.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
