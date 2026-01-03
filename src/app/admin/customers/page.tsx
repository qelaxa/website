"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Phone,
    MapPin,
    UserPlus,
} from "lucide-react";

const customers = [
    { id: 1, name: "Sarah Johnson", email: "sarah.j@email.com", phone: "(419) 555-0101", address: "123 Oak St, Toledo, OH", orders: 12, spent: "$540.00", status: "Active", joined: "Oct 2024" },
    { id: 2, name: "Mike Chen", email: "mike.c@email.com", phone: "(419) 555-0102", address: "456 Elm Ave, Bowling Green, OH", orders: 8, spent: "$320.00", status: "Active", joined: "Nov 2024" },
    { id: 3, name: "Emily Davis", email: "emily.d@email.com", phone: "(419) 555-0103", address: "789 Pine Rd, Perrysburg, OH", orders: 5, spent: "$180.00", status: "Active", joined: "Dec 2024" },
    { id: 4, name: "James Wilson", email: "james.w@email.com", phone: "(419) 555-0104", address: "321 Maple Dr, Maumee, OH", orders: 15, spent: "$720.00", status: "VIP", joined: "Sep 2024" },
    { id: 5, name: "Jessica Brown", email: "jessica.b@email.com", phone: "(419) 555-0105", address: "654 Cedar Ln, Sylvania, OH", orders: 3, spent: "$95.00", status: "New", joined: "Dec 2024" },
    { id: 6, name: "David Miller", email: "david.m@email.com", phone: "(419) 555-0106", address: "987 Birch Blvd, Holland, OH", orders: 0, spent: "$0.00", status: "Inactive", joined: "Nov 2024" },
    { id: 7, name: "Ashley Garcia", email: "ashley.g@email.com", phone: "(419) 555-0107", address: "147 Walnut St, Oregon, OH", orders: 20, spent: "$1,200.00", status: "VIP", joined: "Aug 2024" },
    { id: 8, name: "Robert Taylor", email: "robert.t@email.com", phone: "(419) 555-0108", address: "258 Spruce Way, Rossford, OH", orders: 6, spent: "$245.00", status: "Active", joined: "Oct 2024" },
];

const statusColors: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700",
    VIP: "bg-purple-100 text-purple-700",
    New: "bg-blue-100 text-blue-700",
    Inactive: "bg-gray-100 text-gray-700",
};

export default function CustomersPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
                    <p className="text-gray-500">View and manage your customer base</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" /> Filter
                    </Button>
                    <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg gap-2">
                        <UserPlus className="h-4 w-4" /> Add Customer
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500">Total Customers</p>
                        <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500">VIP Customers</p>
                        <p className="text-2xl font-bold text-purple-600">{customers.filter(c => c.status === "VIP").length}</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500">New This Month</p>
                        <p className="text-2xl font-bold text-blue-600">{customers.filter(c => c.status === "New").length}</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-sm text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-emerald-600">$3,300.00</p>
                    </CardContent>
                </Card>
            </div>

            {/* Customers Table */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <CardTitle>All Customers</CardTitle>
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input placeholder="Search by name, email, phone..." className="pl-9" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left font-medium text-gray-500 pb-4 pl-4">Customer</th>
                                    <th className="text-left font-medium text-gray-500 pb-4 hidden md:table-cell">Contact</th>
                                    <th className="text-left font-medium text-gray-500 pb-4 hidden lg:table-cell">Location</th>
                                    <th className="text-left font-medium text-gray-500 pb-4">Status</th>
                                    <th className="text-right font-medium text-gray-500 pb-4">Orders</th>
                                    <th className="text-right font-medium text-gray-500 pb-4">Spent</th>
                                    <th className="pb-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 pl-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-semibold">
                                                    {customer.name.split(" ").map(n => n[0]).join("")}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{customer.name}</p>
                                                    <p className="text-sm text-gray-500">Since {customer.joined}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 hidden md:table-cell">
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-600 flex items-center gap-1.5">
                                                    <Mail className="h-3.5 w-3.5" /> {customer.email}
                                                </p>
                                                <p className="text-sm text-gray-600 flex items-center gap-1.5">
                                                    <Phone className="h-3.5 w-3.5" /> {customer.phone}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 hidden lg:table-cell">
                                            <p className="text-sm text-gray-600 flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5 flex-shrink-0" /> {customer.address}
                                            </p>
                                        </td>
                                        <td className="py-4">
                                            <Badge className={statusColors[customer.status]}>
                                                {customer.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4 text-right font-medium text-gray-900">{customer.orders}</td>
                                        <td className="py-4 text-right font-medium text-gray-900">{customer.spent}</td>
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
