"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, UserPlus, Eye, Mail, Phone } from "lucide-react";

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalSpend: number;
    status: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch(`/api/customers?search=${searchTerm}`);
                const data = await res.json();
                setCustomers(data);
            } catch (error) {
                console.error("Failed to fetch customers", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchCustomers();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customer Management</h1>
                    <p className="text-gray-500 mt-1">View and manage your customer base.</p>
                </div>
                <Button className="btn-premium gradient-primary shadow-lg hover:shadow-xl">
                    <UserPlus className="h-4 w-4 mr-2" /> Add Customer
                </Button>
            </div>

            <Card className="border-0 shadow-elevated-lg glass-card overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-6 py-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-white text-gray-600 border-gray-200">
                                {customers.length} Customers
                            </Badge>
                        </div>
                        <div className="relative w-full sm:w-72 group">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                            <Input
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all bg-white"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/30 hover:bg-gray-50/30">
                                    <TableHead className="pl-6">Customer</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Orders</TableHead>
                                    <TableHead>Total Spend</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                                            Loading customers...
                                        </TableCell>
                                    </TableRow>
                                ) : customers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                                            No customers found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    customers.map((customer) => (
                                        <TableRow key={customer.id} className="group hover:bg-blue-50/10 transition-colors">
                                            <TableCell className="pl-6 font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                                                        {customer.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{customer.name}</div>
                                                        <div className="text-xs text-gray-400">ID: {customer.id}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Mail className="h-3 w-3 text-gray-400" /> {customer.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone className="h-3 w-3 text-gray-400" /> {customer.phone}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-white">
                                                    {customer.totalOrders} Orders
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-mono font-medium text-gray-900">
                                                ${customer.totalSpend.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={
                                                    customer.status === 'Active'
                                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-none'
                                                }>
                                                    {customer.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 text-gray-400 hover:text-gray-900" asChild>
                                                    <Link href={`/admin/customers/${customer.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
