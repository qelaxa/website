"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Shirt, Sparkles, Bed, Building2, GraduationCap, Check, ArrowRight, Zap, Scissors, Tag, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";

// Icon mapping for dynamic services from Supabase
const iconMap: Record<string, any> = {
    "Shirt": Shirt,
    "Sparkles": Sparkles,
    "Bed": Bed,
    "Building2": Building2,
    "Scissors": Scissors,
    "Tag": Tag,
};

// Gradient mapping based on category
const gradientMap: Record<string, { gradient: string; bgLight: string }> = {
    "wash_fold": { gradient: "from-primary to-cyan-500", bgLight: "bg-blue-50" },
    "dry_cleaning": { gradient: "from-violet-500 to-purple-600", bgLight: "bg-violet-50" },
    "household": { gradient: "from-emerald-500 to-teal-500", bgLight: "bg-emerald-50" },
    "commercial": { gradient: "from-slate-600 to-slate-800", bgLight: "bg-slate-50" },
    "default": { gradient: "from-gray-500 to-gray-700", bgLight: "bg-gray-50" },
};

// Static fallback data (used if Supabase fetch fails)
const fallbackServices = [
    {
        id: "wash-fold",
        name: "Wash & Fold",
        description: "Everyday laundry cleaned, dried, and expertly folded.",
        price: 2.00,
        unit: "lb",
        category: "wash_fold",
        icon: "Shirt",
        is_active: true,
    },
    {
        id: "dry-cleaning",
        name: "Dry Cleaning",
        description: "Professional care for delicate fabrics and formal wear.",
        price: 8.00,
        unit: "item",
        category: "dry_cleaning",
        icon: "Sparkles",
        is_active: true,
    },
    {
        id: "large-items",
        name: "Large Items & Bedding",
        description: "Comforters, rugs, sleeping bags, and oversized items.",
        price: 20.00,
        unit: "item",
        category: "household",
        icon: "Bed",
        is_active: true,
    },
];

const studentSpecial = {
    title: "Student Special",
    description: "Exclusive deal for university students! Fill our bag and pay one flat rate.",
    price: "$25.00",
    priceNote: "Stuff-a-Bag",
    icon: GraduationCap,
    features: ["Use your .edu email", "Valid Student ID Required", "Perfect for dorm life"],
};

interface Service {
    id: string;
    name: string;
    description?: string;
    price: number;
    unit: string;
    category?: string;
    icon?: string;
    is_active?: boolean;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data, error } = await supabase
                    .from('services')
                    .select('*')
                    .eq('is_active', true)
                    .order('name');

                if (error) throw error;
                setServices(data || fallbackServices);
            } catch (error) {
                console.error("Error fetching services:", error);
                setServices(fallbackServices);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const formatPrice = (price: number, unit: string) => {
        if (unit === 'lb') return `$${price.toFixed(2)}/lb`;
        if (unit === 'flat') return `$${price.toFixed(2)}`;
        return `From $${price.toFixed(2)}`;
    };

    const getGradient = (category?: string) => {
        return gradientMap[category || 'default'] || gradientMap['default'];
    };

    const getIcon = (iconName?: string) => {
        return iconMap[iconName || 'Shirt'] || Shirt;
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1">
                {/* Hero */}
                <section className="relative pt-20 pb-24 overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 gradient-mesh" />
                    <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
                    <div className="absolute inset-0 pattern-dots opacity-30" />

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <div className="animate-fade-in-up">
                            <Badge className="mb-4 bg-primary/10 text-primary border-0">
                                <Zap className="h-3 w-3 mr-1" /> Complete Care
                            </Badge>
                        </div>
                        <h1 className="heading-xl text-gray-900 mb-4 animate-fade-in-up delay-100">
                            Our <span className="gradient-text">Services</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-200">
                            From everyday laundry to specialty items, we handle it all with premium care and attention to detail.
                        </p>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="py-20 bg-white relative">
                    <div className="container mx-auto px-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <span className="ml-3 text-gray-600">Loading services...</span>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {services.map((service, index) => {
                                    const { gradient, bgLight } = getGradient(service.category);
                                    const IconComponent = getIcon(service.icon);
                                    const isPopular = service.category === 'wash_fold';

                                    return (
                                        <Card
                                            key={service.id}
                                            className={`relative flex flex-col border-0 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 overflow-hidden animate-fade-in-up group ${isPopular ? 'ring-2 ring-primary/20' : ''}`}
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            {/* Top Gradient Bar */}
                                            <div className={`h-1 bg-gradient-to-r ${gradient}`} />

                                            {isPopular && (
                                                <Badge className="absolute top-4 right-4 gradient-primary text-white border-0 shadow-lg animate-pulse-glow">
                                                    Most Popular
                                                </Badge>
                                            )}

                                            <CardHeader className="pb-4">
                                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                    <IconComponent className="h-7 w-7 text-white" />
                                                </div>
                                                <CardTitle className="text-xl">{service.name}</CardTitle>
                                                <CardDescription className="text-base">
                                                    {service.description || "Professional laundry care service."}
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent className="flex-1 space-y-6">
                                                <div>
                                                    <span className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                                                        {formatPrice(service.price, service.unit)}
                                                    </span>
                                                    <span className="text-sm text-gray-500 ml-2">
                                                        {service.unit === 'lb' ? '$30 minimum' : 'Per item'}
                                                    </span>
                                                </div>
                                            </CardContent>

                                            <CardFooter className="pt-4">
                                                <Button
                                                    className={`w-full h-12 btn-premium ${isPopular ? `bg-gradient-to-r ${gradient} border-0 shadow-lg text-white` : ''}`}
                                                    variant={isPopular ? "default" : "outline"}
                                                    asChild
                                                >
                                                    <Link href="/book" className="gap-2">
                                                        Book Now
                                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                    </Link>
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* Student Special */}
                <section className="py-20 relative overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl" />
                    <div className="absolute inset-0 pattern-dots opacity-20" />

                    <div className="container mx-auto px-4 relative z-10">
                        <Card className="max-w-3xl mx-auto border-0 shadow-elevated-lg overflow-hidden animate-fade-in-up">
                            {/* Top Gradient */}
                            <div className="h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />

                            <CardHeader className="text-center pt-10 pb-6">
                                {/* Icon */}
                                <div className="relative w-20 h-20 mx-auto mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl transform rotate-6 opacity-20" />
                                    <div className="relative w-full h-full bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl flex items-center justify-center shadow-xl">
                                        <GraduationCap className="h-10 w-10 text-white" />
                                    </div>
                                </div>

                                <Badge className="mx-auto bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-lg mb-4 text-sm px-4 py-1">
                                    🎓 Students Exclusive
                                </Badge>
                                <CardTitle className="text-3xl mb-2">{studentSpecial.title}</CardTitle>
                                <CardDescription className="text-lg max-w-md mx-auto">
                                    {studentSpecial.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="text-center pb-8">
                                <div className="mb-8">
                                    <span className="text-6xl font-bold gradient-text-orange">
                                        {studentSpecial.price}
                                    </span>
                                    <span className="text-xl text-gray-500 ml-3">{studentSpecial.priceNote}</span>
                                </div>

                                <div className="flex flex-wrap justify-center gap-3">
                                    {studentSpecial.features.map((feature, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 text-sm bg-white border border-orange-100 px-4 py-2.5 rounded-full shadow-sm"
                                        >
                                            <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                                                <Check className="h-3 w-3 text-orange-600" />
                                            </div>
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter className="justify-center pb-10">
                                <Button
                                    className="h-14 px-10 text-lg btn-premium bg-gradient-to-r from-orange-500 to-amber-500 border-0 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                                    size="lg"
                                    asChild
                                >
                                    <Link href="/book?student=true" className="gap-2">
                                        Claim Student Special
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
