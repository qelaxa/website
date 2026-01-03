"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    ArrowRight,
    MapPin,
    ArrowLeft
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
    const [cardType, setCardType] = useState<"visa" | "mastercard" | "unknown">("unknown");

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
        if (v.startsWith("4")) setCardType("visa");
        else if (v.startsWith("5")) setCardType("mastercard");
        else setCardType("unknown");

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
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 flex items-center justify-center py-12 relative overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 gradient-mesh" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[600px] h-[600px] bg-emerald-200/30 rounded-full blur-3xl animate-pulse" />
                    </div>

                    <Card className="max-w-md w-full text-center border-0 shadow-elevated-lg glass-card animate-scale-in relative z-10 overflow-hidden m-4">
                        <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
                        <CardContent className="pt-12 pb-10 px-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl animate-bounce-subtle">
                                <CheckCircle className="h-12 w-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold mb-3 text-gray-900 tracking-tight">Order Confirmed!</h2>
                            <p className="text-gray-600 mb-8 text-lg">Your laundry pickup has been successfully scheduled.</p>

                            <div className="bg-white/50 rounded-2xl p-6 mb-8 text-left border border-white/50 shadow-inner">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                                        <Package className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Service</p>
                                        <p className="font-bold text-gray-900">{service}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Date & Time</p>
                                        <p className="font-bold text-gray-900">{date} • {time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                                        <Truck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Delivery</p>
                                        <p className="font-bold text-gray-900">Included (Free)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    className="h-12 w-full btn-premium gradient-primary text-white text-lg shadow-lg hover:shadow-xl"
                                    onClick={() => router.push("/my-bookings")}
                                >
                                    Track Order
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="h-12 w-full hover:bg-gray-100/50"
                                    onClick={() => router.push("/")}
                                >
                                    Return Home
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
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 py-16 relative overflow-hidden bg-gray-50/30">
                {/* Background */}
                <div className="absolute inset-0 gradient-mesh opacity-30" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 max-w-5xl relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/50" onClick={() => router.back()}>
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </Button>
                        <h1 className="heading-lg text-gray-900">Secure Checkout</h1>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Payment Form */}
                        <div className="lg:col-span-3">
                            <Card className="border-0 shadow-elevated-lg glass-card overflow-hidden animate-fade-in-up">
                                <CardHeader className="border-b border-gray-100/50 pb-6">
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <CreditCard className="h-5 w-5 text-primary" />
                                        </div>
                                        Payment Method
                                    </CardTitle>
                                    <CardDescription>Enter your payment details to complete your booking</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-8 space-y-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2 group">
                                            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Cardholder Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="John Doe"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-xl"
                                            />
                                        </div>

                                        <div className="space-y-2 group">
                                            <Label htmlFor="card" className="text-sm font-semibold text-gray-700">Card Number</Label>
                                            <div className="relative">
                                                <Input
                                                    id="card"
                                                    placeholder="0000 0000 0000 0000"
                                                    value={cardNumber}
                                                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                                    maxLength={19}
                                                    required
                                                    className="h-12 pl-4 pr-20 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-xl font-mono"
                                                />
                                                <div className="absolute right-4 top-3.5 flex gap-2 transition-opacity duration-300">
                                                    <div className={`w-8 h-5 rounded flex items-center justify-center text-[8px] font-bold border transition-all ${cardType === 'visa' ? 'bg-blue-600 text-white border-blue-600 scale-110 shadow-sm' : 'bg-gray-100 text-gray-400 border-gray-200 opacity-50'}`}>VISA</div>
                                                    <div className={`w-8 h-5 rounded flex items-center justify-center text-[8px] font-bold border transition-all ${cardType === 'mastercard' ? 'bg-red-500 text-white border-red-500 scale-110 shadow-sm' : 'bg-gray-100 text-gray-400 border-gray-200 opacity-50'}`}>MC</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2 group">
                                                <Label htmlFor="expiry" className="text-sm font-semibold text-gray-700">Expiry Date</Label>
                                                <Input
                                                    id="expiry"
                                                    placeholder="MM/YY"
                                                    value={expiry}
                                                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                                    maxLength={5}
                                                    required
                                                    className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-xl text-center"
                                                />
                                            </div>
                                            <div className="space-y-2 group">
                                                <Label htmlFor="cvc" className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                                                    CVC
                                                    <Shield className="h-3 w-3 text-gray-400" />
                                                </Label>
                                                <Input
                                                    id="cvc"
                                                    placeholder="123"
                                                    value={cvc}
                                                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                                    maxLength={4}
                                                    required
                                                    className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-xl text-center"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            <div className="flex items-center gap-3 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 mb-6">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                                    <Lock className="h-4 w-4 text-emerald-600" />
                                                </div>
                                                <div className="text-sm text-emerald-800">
                                                    <p className="font-semibold">Secure Payment</p>
                                                    <p className="opacity-80">Your payment information is encrypted and secure.</p>
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full h-14 text-lg font-semibold btn-premium gradient-primary shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all rounded-xl group"
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? (
                                                    <span className="flex items-center gap-2">
                                                        <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        Pay ${price} <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                    </form>

                                    <div className="text-center">
                                        <p className="text-xs text-gray-400 bg-gray-50 inline-block px-3 py-1 rounded-full border border-gray-100">
                                            <strong>Demo Mode:</strong> No real charges will be made.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-2">
                            <div className="sticky top-24 space-y-6">
                                <Card className="border-0 shadow-elevated-lg glass-card animate-fade-in-up delay-100 overflow-hidden">
                                    <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg">Order Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">{service}</h3>
                                                <p className="text-sm text-gray-500">Regular Service</p>
                                            </div>
                                            <span className="font-bold text-xl text-primary">${price}</span>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Pickup Schedule</p>
                                                    <p className="text-sm text-gray-500">{date}</p>
                                                    <p className="text-sm text-gray-500">{time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Location</p>
                                                    <p className="text-sm text-gray-500">123 University Blvd</p>
                                                    <p className="text-xs text-gray-400">Primary Address</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50/80 rounded-xl p-4 space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Subtotal</span>
                                                <span className="font-medium">${price}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Delivery</span>
                                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 font-bold">FREE</Badge>
                                            </div>
                                            <Separator className="bg-gray-200" />
                                            <div className="flex justify-between items-end">
                                                <span className="font-bold text-gray-900">Total</span>
                                                <span className="text-2xl font-bold gradient-text">${price}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                            <Shield className="h-3.5 w-3.5" />
                                            <span>100% Satisfaction Guarantee</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
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
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <CheckoutContent />
        </Suspense>
    );
}
