"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Search,
    Filter,
    Eye,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    Loader2,
    Package,
    ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

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

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
    "Confirmed": { color: "bg-blue-100 text-blue-700", icon: Package },
    "In Progress": { color: "bg-blue-100 text-blue-700", icon: Clock },
    "Picked Up": { color: "bg-orange-100 text-orange-700", icon: Truck },
    "Delivered": { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
    "Washing": { color: "bg-cyan-100 text-cyan-700", icon: Clock },
    "Completed": { color: "bg-green-100 text-green-700", icon: CheckCircle },
    "Cancelled": { color: "bg-red-100 text-red-700", icon: XCircle },
    "Ready": { color: "bg-purple-100 text-purple-700", icon: CheckCircle },
    "Out for Delivery": { color: "bg-amber-100 text-amber-700", icon: Truck },
};

const statusOptions = ["Confirmed", "Picked Up", "Washing", "In Progress", "Ready", "Out for Delivery", "Delivered", "Completed", "Cancelled"];

import { createClient } from "@/lib/supabase";

// ... imports

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

// ... statusConfig

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const supabase = createClient();

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    profiles (full_name, email, preferences)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const mappedOrders: Order[] = (data || []).map((o: any) => {
                const item = o.items && o.items[0] ? o.items[0] : { name: 'Unknown Service' };
                // Format preferences for display
                const prefs = o.profiles?.preferences || {};
                const prefString = Object.entries(prefs)
                    .filter(([_, v]) => v !== false && v !== "")
                    .map(([k, v]) => `${k}: ${v === true ? 'Yes' : v}`)
                    .join(', ');

                return {
                    id: o.id,
                    customer: o.profiles?.full_name || 'Guest',
                    email: o.profiles?.email || '',
                    service: item.name,
                    status: o.status || 'Pending',
                    total: `$${o.total_amount?.toFixed(2)}`,
                    date: new Date(o.created_at).toLocaleDateString(),
                    time: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    // Add preferences for tooltip
                    preferences: prefString || 'No specific preferences'
                };
            });

            setOrders(mappedOrders);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    }

    async function updateOrderStatus(orderId: string, newStatus: string) {
        setUpdatingId(orderId);
        setOpenDropdown(null);

        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            toast.success(`Order updated`);
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update order");
        } finally {
            setUpdatingId(null);
        }
    }

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
                    <p className="text-gray-500">Manage and track all customer orders</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" /> Filter
                    </Button>
                    <Button
                        onClick={fetchOrders}
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg"
                    >
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Orders Table */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <CardTitle>All Orders ({orders.length})</CardTitle>
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by order ID, customer..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
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
                                    <th className="text-left font-medium text-gray-500 pb-4 hidden lg:table-cell">Date</th>
                                    <th className="text-right font-medium text-gray-500 pb-4 pr-4">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => {
                                    const status = statusConfig[order.status] || statusConfig["In Progress"];
                                    const StatusIcon = status.icon;
                                    const isUpdating = updatingId === order.id;
                                    const isDropdownOpen = openDropdown === order.id;

                                    return (
                                        <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 pl-4">
                                                <span className="font-mono text-sm font-medium text-gray-900">{order.id}</span>
                                            </td>
                                            <td className="py-4">
                                                <div>
                                                    <div className="group relative">
                                                        <p className="font-medium text-gray-900 cursor-help underline decoration-dotted decoration-gray-300">
                                                            {order.customer}
                                                        </p>
                                                        {/* Tooltip */}
                                                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-50">
                                                            <div className="font-bold mb-1 border-b border-gray-700 pb-1">Care Preferences</div>
                                                            {/* @ts-ignore */}
                                                            {order.preferences}
                                                            <div className="absolute bottom-[-4px] left-4 w-2 h-2 bg-gray-900 rotate-45"></div>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-500">{order.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 text-gray-600 hidden md:table-cell">{order.service}</td>
                                            <td className="py-4 relative">
                                                <button
                                                    onClick={() => setOpenDropdown(isDropdownOpen ? null : order.id)}
                                                    disabled={isUpdating}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Badge className={`${status.color} gap-1.5 cursor-pointer hover:opacity-80`}>
                                                        {isUpdating ? (
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        ) : (
                                                            <StatusIcon className="h-3 w-3" />
                                                        )}
                                                        {order.status}
                                                        <ChevronDown className="h-3 w-3" />
                                                    </Badge>
                                                </button>

                                                {isDropdownOpen && (
                                                    <div className="absolute z-10 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                                                        {statusOptions.map((statusOption) => (
                                                            <button
                                                                key={statusOption}
                                                                onClick={() => updateOrderStatus(order.id, statusOption)}
                                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${order.status === statusOption ? "font-medium text-teal-600 bg-teal-50" : "text-gray-700"
                                                                    }`}
                                                            >
                                                                {statusOption}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4 hidden lg:table-cell">
                                                <div>
                                                    <p className="text-gray-900">{order.date}</p>
                                                    <p className="text-sm text-gray-500">{order.time}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 text-right font-medium text-gray-900 pr-4">{order.total}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filteredOrders.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No orders found
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
