import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Shirt, Sparkles, Bed, Building2, GraduationCap, Check, ArrowRight, Zap } from "lucide-react";

const services = [
    {
        id: "wash-fold",
        title: "Wash & Fold",
        description: "Everyday laundry cleaned, dried, and expertly folded.",
        price: "$2.00/lb",
        priceNote: "$30 minimum",
        icon: Shirt,
        features: ["Same-day pickup available", "Eco-friendly detergents", "Custom folding preferences"],
        popular: true,
        gradient: "from-primary to-cyan-500",
        bgLight: "bg-blue-50",
    },
    {
        id: "dry-cleaning",
        title: "Dry Cleaning",
        description: "Professional care for delicate fabrics and formal wear.",
        price: "From $8.00",
        priceNote: "Per item",
        icon: Sparkles,
        features: ["Suits & formal wear", "Wedding dresses", "Leather & suede"],
        popular: false,
        gradient: "from-violet-500 to-purple-600",
        bgLight: "bg-violet-50",
    },
    {
        id: "large-items",
        title: "Large Items & Bedding",
        description: "Comforters, rugs, sleeping bags, and oversized items.",
        price: "From $20.00",
        priceNote: "Flat rate per item",
        icon: Bed,
        features: ["Comforters & duvets", "Area rugs", "Sleeping bags"],
        popular: false,
        gradient: "from-emerald-500 to-teal-500",
        bgLight: "bg-emerald-50",
    },
    {
        id: "commercial",
        title: "Commercial Linens",
        description: "Restaurant, hotel, and business linen services.",
        price: "Custom Quote",
        priceNote: "Volume pricing",
        icon: Building2,
        features: ["Tablecloths & napkins", "Towels & sheets", "Uniforms"],
        popular: false,
        gradient: "from-slate-600 to-slate-800",
        bgLight: "bg-slate-50",
    },
];

const studentSpecial = {
    title: "Student Special",
    description: "Exclusive deal for BGSU students! Fill our bag and pay one flat rate.",
    price: "$25.00",
    priceNote: "Stuff-a-Bag",
    icon: GraduationCap,
    features: ["Use your .edu email", "Available in Bowling Green area", "Perfect for dorm life"],
};

export default function ServicesPage() {
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
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {services.map((service, index) => (
                                <Card
                                    key={service.id}
                                    className={`relative flex flex-col border-0 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 overflow-hidden animate-fade-in-up group ${service.popular ? 'ring-2 ring-primary/20' : ''}`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Top Gradient Bar */}
                                    <div className={`h-1 bg-gradient-to-r ${service.gradient}`} />

                                    {service.popular && (
                                        <Badge className="absolute top-4 right-4 gradient-primary text-white border-0 shadow-lg animate-pulse-glow">
                                            Most Popular
                                        </Badge>
                                    )}

                                    <CardHeader className="pb-4">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <service.icon className="h-7 w-7 text-white" />
                                        </div>
                                        <CardTitle className="text-xl">{service.title}</CardTitle>
                                        <CardDescription className="text-base">{service.description}</CardDescription>
                                    </CardHeader>

                                    <CardContent className="flex-1 space-y-6">
                                        <div>
                                            <span className={`text-3xl font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                                                {service.price}
                                            </span>
                                            <span className="text-sm text-gray-500 ml-2">{service.priceNote}</span>
                                        </div>
                                        <ul className="space-y-3">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                                                    <div className={`w-5 h-5 rounded-full ${service.bgLight} flex items-center justify-center shrink-0`}>
                                                        <Check className="h-3 w-3 text-emerald-600" />
                                                    </div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>

                                    <CardFooter className="pt-4">
                                        <Button
                                            className={`w-full h-12 btn-premium ${service.popular ? `bg-gradient-to-r ${service.gradient} border-0 shadow-lg text-white` : ''}`}
                                            variant={service.popular ? "default" : "outline"}
                                            asChild
                                        >
                                            <Link href="/book" className="gap-2">
                                                Book Now
                                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
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
                                    🎓 BGSU Exclusive
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
