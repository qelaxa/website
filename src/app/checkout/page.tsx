"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    CreditCard,
    Lock,
    CheckCircle,
    Loader2,
    Shield,
    Truck,
    Calendar,
    Package,
} from "lucide-react";
import toast from "react-hot-toast";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();

    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [name, setName] = useState("");

    // Get order details from URL params (passed from booking)
    const service = searchParams.get("service") || "Wash & Fold";
    const price = searchParams.get("price") || "25.00";
    const date = searchParams.get("date") || "Tomorrow";
    const time = searchParams.get("time") || "9:00 AM - 12:00 PM";

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || "";
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(" ") : value;
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        if (v.length >= 2) {
            return v.slice(0, 2) + "/" + v.slice(2, 4);
        }
        return v;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Create order via API
        try {
            const newOrder = {
                id: `LQ-${Date.now().toString().slice(-4)}`,
                customer: user?.name || name,
                email: user?.email || "guest@example.com",
                service,
                status: "Confirmed",
                total: `$${price}`,
                date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
            };

            const res = await fetch("/api/orders", { method: "GET" });
            const orders = await res.json();
            orders.unshift(newOrder);
            await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orders),
            });

            setIsComplete(true);
            toast.success("Payment successful! Order confirmed.");
        } catch (error) {
            toast.error("Payment failed. Please try again.");
        }

        setIsProcessing(false);
    };

    if (isComplete) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
                <Navbar />
                <main className="flex-1 flex items-center justify-center py-12 px-4">
                    <Card className="w-full max-w-md border-0 shadow-xl text-center">
                        <CardContent className="pt-12 pb-8">
                            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6">
                                <CheckCircle className="h-10 w-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                            <p className="text-gray-500 mb-6">Your laundry pickup has been scheduled.</p>

                            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                                <div className="flex items-center gap-3 mb-3">
                                    <Package className="h-5 w-5 text-teal-500" />
                                    <span className="font-medium">{service}</span>
                                </div>
                                <div className="flex items-center gap-3 mb-3">
                                    <Calendar className="h-5 w-5 text-teal-500" />
                                    <span>{date} • {time}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Truck className="h-5 w-5 text-teal-500" />
                                    <span>Free pickup & delivery</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => router.push("/my-bookings")}
                                >
                                    View Orders
                                </Button>
                                <Button
                                    className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                                    onClick={() => router.push("/")}
                                >
                                    Done
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />

            <main className="flex-1 py-12 px-4">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Secure Checkout</h1>

                    <div className="grid md:grid-cols-5 gap-8">
                        {/* Payment Form */}
                        <div className="md:col-span-3">
                            <Card className="border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-teal-500" />
                                        Payment Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Cardholder Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="John Doe"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="card">Card Number</Label>
                                            <div className="relative">
                                                <Input
                                                    id="card"
                                                    placeholder="4242 4242 4242 4242"
                                                    value={cardNumber}
                                                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                                    maxLength={19}
                                                    required
                                                />
                                                <div className="absolute right-3 top-2.5 flex gap-1">
                                                    <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] flex items-center justify-center font-bold">VISA</div>
                                                    <div className="w-8 h-5 bg-red-500 rounded text-white text-[8px] flex items-center justify-center font-bold">MC</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="expiry">Expiry Date</Label>
                                                <Input
                                                    id="expiry"
                                                    placeholder="MM/YY"
                                                    value={expiry}
                                                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                                    maxLength={5}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cvc">CVC</Label>
                                                <Input
                                                    id="cvc"
                                                    placeholder="123"
                                                    value={cvc}
                                                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                                    maxLength={4}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <Separator className="my-6" />

                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                            <Lock className="h-4 w-4" />
                                            <span>Your payment is secure and encrypted</span>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg h-12 text-lg"
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                `Pay $${price}`
                                            )}
                                        </Button>
                                    </form>

                                    <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-100">
                                        <p className="text-xs text-amber-700 text-center">
                                            <strong>Demo Mode:</strong> Use any card details. No real charges will be made.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="md:col-span-2">
                            <Card className="border-0 shadow-lg sticky top-24">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{service}</span>
                                        <span className="font-medium">${price}</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Pickup Date</span>
                                        <span>{date}</span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Time Window</span>
                                        <span>{time}</span>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Delivery</span>
                                        <Badge className="bg-emerald-100 text-emerald-700">FREE</Badge>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-teal-600">${price}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 pt-4">
                                        <Shield className="h-4 w-4 text-teal-500" />
                                        <span>100% Satisfaction Guarantee</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-teal-500" /></div>}>
            <CheckoutContent />
        </Suspense>
    );
}
