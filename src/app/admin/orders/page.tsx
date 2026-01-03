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

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    }

    async function updateOrderStatus(orderId: string, newStatus: string) {
        setUpdatingId(orderId);
        setOpenDropdown(null);

        try {
            const order = orders.find(o => o.id === orderId);
            if (!order) return;

            const updatedOrder = { ...order, status: newStatus };
            const res = await fetch("/api/orders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedOrder),
            });

            if (res.ok) {
                setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
                toast.success(`Order ${orderId} updated to "${newStatus}"`);
            }
        } catch (error) {
            toast.error("Failed to update order");
        } finally {
            setUpdatingId(null);
        }
    }

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.service.toLowerCase().includes(searchTerm.toLowerCase())
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
                                                    <p className="font-medium text-gray-900">{order.customer}</p>
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
