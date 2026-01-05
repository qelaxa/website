"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, UserPlus, Eye, Mail, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";

interface Customer {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    created_at: string;
    role: string;
}

export default function CustomersPage() {
    const supabase = createClient();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchCustomers = async () => {
            // Basic implementation: Fetch profiles
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .neq('role', 'admin') // Optional: only show customers, hide admins
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setCustomers(data || []);
            } catch (error) {
                console.error("Failed to fetch customers", error);
                toast.error("Failed to load customers");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(c =>
        (c.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customer Management</h1>
                    <p className="text-gray-500 mt-1">View and manage your customer base.</p>
                </div>
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
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Role</TableHead>
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
                                ) : filteredCustomers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                                            No customers found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCustomers.map((customer) => (
                                        <TableRow key={customer.id} className="group hover:bg-blue-50/10 transition-colors">
                                            <TableCell className="pl-6 font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                                                        {(customer.full_name || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{customer.full_name || 'Unknown User'}</div>
                                                        <div className="text-xs text-gray-400 truncate max-w-[150px]">ID: {customer.id}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Mail className="h-3 w-3 text-gray-400" /> {customer.email}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                {new Date(customer.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={
                                                    customer.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-700 border-none'
                                                        : 'bg-emerald-100 text-emerald-700 border-none'
                                                }>
                                                    {customer.role || 'Customer'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 text-gray-400 hover:text-gray-900" disabled>
                                                    <Eye className="h-4 w-4" />
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
