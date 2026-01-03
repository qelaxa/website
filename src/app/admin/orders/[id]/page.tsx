"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Added useParams and useRouter
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    ArrowLeft, Printer, Truck, Package, User, MapPin, Phone,
    CreditCard, Calendar, Clock, CheckCircle, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

// Mock data (replace with real fetch)
const MOCK_ORDER = {
    id: "LQ-2849",
    created: "2023-10-24T09:30:00",
    customer: {
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "(419) 555-0123",
        address: "123 Maple Ave, Toledo, OH 43606",
        notes: "Gate code #1234. Please ring bell.",
    },
    service: {
        type: "Wash & Fold",
        detail: "25lbs Estimated",
        preferences: {
            detergent: "Scented",
            softener: true,
            bleach: false,
            fold: "Standard"
        }
    },
    schedule: {
        pickup: "2023-10-25 (Morning)",
        delivery: "2023-10-26 (Afternoon)",
    },
    financials: {
        subtotal: 50.00,
        tax: 3.50,
        tip: 5.00,
        total: 58.50,
        paymentStatus: "paid",
        paymentMethod: "Visa ending in 4242"
    },
    status: "washing", // pending, washing, out-for-delivery, completed, cancelled
    timeline: [
        { status: "Order Placed", date: "Oct 24, 09:30 AM", completed: true },
        { status: "Picked Up", date: "Oct 25, 10:15 AM", completed: true },
        { status: "Washing", date: "Oct 25, 02:00 PM", completed: true },
        { status: "Out for Delivery", date: null, completed: false },
        { status: "Delivered", date: null, completed: false },
    ]
};

export default function OrderDetailsPage() {
    const params = useParams(); // Use useParams hook
    const router = useRouter(); // Use useRouter hook
    const [status, setStatus] = useState("washing");
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveStatus = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            // In a real app, update timeline/notify user here
        }, 1000);
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()} className="h-10 w-10">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">Order #{params.id || MOCK_ORDER.id}</h1>
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                                {status.replace("-", " ")}
                            </Badge>
                        </div>
                        <p className="text-gray-500 text-sm mt-1">Placed on {new Date(MOCK_ORDER.created).toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <Printer className="h-4 w-4" /> Print Label
                    </Button>
                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200">
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[180px] border-0 focus:ring-0">
                                <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="picked-up">Picked Up</SelectItem>
                                <SelectItem value="washing">Washing</SelectItem>
                                <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            className="h-8 px-3 btn-premium gradient-primary"
                            size="sm"
                            onClick={handleSaveStatus}
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Update"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Timeline */}
                    <Card className="border-0 shadow-sm glass-card">
                        <CardHeader>
                            <CardTitle className="text-lg">Order Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative flex justify-between">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0" />
                                {MOCK_ORDER.timeline.map((step, i) => (
                                    <div key={step.status} className="relative z-10 flex flex-col items-center bg-white px-2">
                                        <div className={cn(
                                            "w-4 h-4 rounded-full border-2 mb-2",
                                            step.completed ? "bg-primary border-primary" : "bg-white border-gray-300"
                                        )} />
                                        <span className={cn(
                                            "text-xs font-medium",
                                            step.completed ? "text-gray-900" : "text-gray-400"
                                        )}>{step.status}</span>
                                        {step.date && <span className="text-[10px] text-gray-400">{step.date.split(',')[0]}</span>}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Service Details */}
                    <Card className="border-0 shadow-sm glass-card overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Package className="h-5 w-5 text-gray-500" />
                                Service Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{MOCK_ORDER.service.type}</h3>
                                    <p className="text-gray-500">{MOCK_ORDER.service.detail}</p>
                                </div>
                                <Badge variant="outline" className="text-lg px-3 py-1">
                                    Running Total: ${MOCK_ORDER.financials.total.toFixed(2)}
                                </Badge>
                            </div>

                            <Separator className="my-6" />

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3 block">Preferences</h4>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex justify-between">
                                            <span>Detergent:</span> <span className="font-medium text-gray-900">{MOCK_ORDER.service.preferences.detergent}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Fold Style:</span> <span className="font-medium text-gray-900">{MOCK_ORDER.service.preferences.fold}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Softener:</span> <span className="font-medium text-gray-900">{MOCK_ORDER.service.preferences.softener ? "Yes" : "No"}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3 block">Before & After Photos</h4>
                                    <div className="flex gap-2">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
                                            <Package className="h-6 w-6" />
                                        </div>
                                        <Button variant="outline" className="h-20 w-20 border-dashed">
                                            + Add
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Customer & Schedule */}
                <div className="space-y-6">
                    {/* Customer Card */}
                    <Card className="border-0 shadow-sm glass-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <User className="h-4 w-4 text-gray-500" /> Customer Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold">
                                    SJ
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{MOCK_ORDER.customer.name}</div>
                                    <div className="text-gray-500">{MOCK_ORDER.customer.email}</div>
                                </div>
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="flex gap-3">
                                    <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                                    <span className="text-gray-600">{MOCK_ORDER.customer.phone}</span>
                                </div>
                                <div className="flex gap-3">
                                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                                    <div>
                                        <span className="text-gray-600 block">{MOCK_ORDER.customer.address}</span>
                                        {MOCK_ORDER.customer.notes && (
                                            <div className="mt-2 text-xs bg-amber-50 text-amber-700 p-2 rounded-lg border border-amber-100 flex gap-2">
                                                <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                                                {MOCK_ORDER.customer.notes}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50/50 py-3">
                            <Button variant="ghost" size="sm" className="w-full text-primary hover:text-primary/80">View Profile</Button>
                        </CardFooter>
                    </Card>

                    {/* Schedule Card */}
                    <Card className="border-0 shadow-sm glass-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Calendar className="h-4 w-4 text-gray-500" /> Schedule
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex gap-3 items-start">
                                <div className="mt-0.5 w-2 h-2 rounded-full bg-emerald-500" />
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wider font-semibold">Pickup</span>
                                    <span className="font-medium text-gray-900">{MOCK_ORDER.schedule.pickup}</span>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="mt-0.5 w-2 h-2 rounded-full bg-blue-500" />
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wider font-semibold">Estimated Delivery</span>
                                    <span className="font-medium text-gray-900">{MOCK_ORDER.schedule.delivery}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Card */}
                    <Card className="border-0 shadow-sm glass-card">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CreditCard className="h-4 w-4 text-gray-500" /> Payment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>${MOCK_ORDER.financials.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span>${MOCK_ORDER.financials.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tip</span>
                                <span>${MOCK_ORDER.financials.tip.toFixed(2)}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-bold text-gray-900">
                                <span>Total</span>
                                <span>${MOCK_ORDER.financials.total.toFixed(2)}</span>
                            </div>
                            <div className="pt-2 flex items-center gap-2 text-gray-500 font-medium">
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                Paid via Visa •••• 4242
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
