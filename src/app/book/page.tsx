"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    MapPin, ArrowRight, ArrowLeft, Check, ShoppingBag,
    Calendar, CreditCard, Shirt, Bed, Sparkles, GraduationCap,
    AlertTriangle, CheckCircle, Truck, Package
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "location" | "services" | "schedule" | "review";

// Pricing
const PRICE_PER_LB = 2.0;
const MIN_ORDER = 30.0;
const SURCHARGE_AREAS = ["43551", "43560"];
const SURCHARGE_AMOUNT = 5.0;
const STANDARD_AREAS = ["43402", "43403", "43537"];
const STUDENT_PRICE = 25.0;

const services = [
    { id: "wash-fold", name: "Wash & Fold", price: PRICE_PER_LB, unit: "/lb", icon: Shirt, description: "Everyday laundry" },
    { id: "comforter", name: "Comforter", price: 20, unit: "each", icon: Bed, description: "Queen/King size" },
    { id: "comforter-twin", name: "Comforter (Twin)", price: 15, unit: "each", icon: Bed, description: "Twin/Full size" },
    { id: "dry-clean", name: "Dry Cleaning", price: 8, unit: "/item", icon: Sparkles, description: "Suits, formal wear" },
];

const stepInfo = {
    location: { icon: MapPin, title: "Location", color: "from-blue-500 to-cyan-500" },
    services: { icon: ShoppingBag, title: "Services", color: "from-violet-500 to-purple-500" },
    schedule: { icon: Calendar, title: "Schedule", color: "from-emerald-500 to-teal-500" },
    review: { icon: CreditCard, title: "Review", color: "from-orange-500 to-amber-500" },
};

function BookingContent() {
    const searchParams = useSearchParams();
    const isStudentMode = searchParams.get("student") === "true";

    const [step, setStep] = useState<Step>("location");
    const [formData, setFormData] = useState({
        zipCode: "",
        address: "",
        selectedService: isStudentMode ? "student-special" : "wash-fold",
        estimatedWeight: 15,
        items: {} as Record<string, number>,
        pickupDate: "",
        pickupTime: "morning",
        specialInstructions: "",
    });

    const [zipStatus, setZipStatus] = useState<"valid" | "surcharge" | "invalid" | null>(null);
    const [isStudentEligible] = useState(isStudentMode);

    // Check zip code
    const checkZip = () => {
        const zip = formData.zipCode;
        if (zip.startsWith("436") || STANDARD_AREAS.includes(zip)) {
            setZipStatus("valid");
            return true;
        }
        if (SURCHARGE_AREAS.includes(zip)) {
            setZipStatus("surcharge");
            return true;
        }
        setZipStatus("invalid");
        return false;
    };

    // Calculate total
    const calculateTotal = () => {
        if (formData.selectedService === "student-special") {
            return STUDENT_PRICE + (zipStatus === "surcharge" ? SURCHARGE_AMOUNT : 0);
        }

        let subtotal = 0;

        if (formData.selectedService === "wash-fold") {
            subtotal = Math.max(formData.estimatedWeight * PRICE_PER_LB, MIN_ORDER);
        } else {
            // Sum up items
            Object.entries(formData.items).forEach(([id, qty]) => {
                const service = services.find(s => s.id === id);
                if (service) subtotal += service.price * qty;
            });
        }

        if (zipStatus === "surcharge") {
            subtotal += SURCHARGE_AMOUNT;
        }

        return subtotal;
    };

    const steps: Step[] = ["location", "services", "schedule", "review"];
    const currentStepIndex = steps.indexOf(step);

    const nextStep = () => {
        if (step === "location" && !checkZip()) return;
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < steps.length) {
            setStep(steps[nextIndex]);
        }
    };

    const prevStep = () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setStep(steps[prevIndex]);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 py-12 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 gradient-mesh" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 max-w-3xl relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8 animate-fade-in-up">
                        <Badge className="mb-4 bg-primary/10 text-primary border-0">
                            <Truck className="h-3 w-3 mr-1" /> Book Pickup
                        </Badge>
                        <h1 className="heading-lg text-gray-900 mb-2">Schedule Your Pickup</h1>
                        <p className="text-gray-600">We'll handle the rest with care</p>
                    </div>

                    {/* Premium Progress Stepper */}
                    <div className="mb-10 animate-fade-in-up delay-100">
                        <div className="relative">
                            {/* Progress Line Background */}
                            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full" />
                            {/* Progress Line Active */}
                            <div
                                className="absolute top-6 left-0 h-1 gradient-primary rounded-full transition-all duration-500"
                                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                            />

                            <div className="relative flex justify-between">
                                {steps.map((s, idx) => {
                                    const info = stepInfo[s];
                                    const Icon = info.icon;
                                    const isActive = idx === currentStepIndex;
                                    const isComplete = idx < currentStepIndex;

                                    return (
                                        <div key={s} className="flex flex-col items-center">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg",
                                                isComplete && "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white",
                                                isActive && `bg-gradient-to-br ${info.color} text-white animate-pulse-glow`,
                                                !isActive && !isComplete && "bg-white text-gray-400 border-2 border-gray-200"
                                            )}>
                                                {isComplete ? (
                                                    <Check className="h-5 w-5" />
                                                ) : (
                                                    <Icon className="h-5 w-5" />
                                                )}
                                            </div>
                                            <span className={cn(
                                                "mt-3 text-sm font-medium transition-colors",
                                                isActive ? "text-gray-900" : "text-gray-500"
                                            )}>
                                                {info.title}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Step 1: Location */}
                    {step === "location" && (
                        <Card className="animate-fade-in-up glass-card border-0 shadow-elevated-lg overflow-hidden">
                            <div className="h-1 gradient-primary" />
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-white" />
                                    </div>
                                    Where should we pick up?
                                </CardTitle>
                                <CardDescription className="text-base">
                                    We'll verify your address is in our service area.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="zip" className="text-sm font-semibold">Zip Code</Label>
                                    <Input
                                        id="zip"
                                        value={formData.zipCode}
                                        onChange={(e) => {
                                            setFormData({ ...formData, zipCode: e.target.value });
                                            setZipStatus(null);
                                        }}
                                        placeholder="e.g., 43606"
                                        maxLength={5}
                                        className="h-12 text-lg font-mono border-2 focus:border-primary"
                                    />
                                    {zipStatus === "valid" && (
                                        <div className="flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 p-3 rounded-xl animate-fade-in">
                                            <CheckCircle className="h-4 w-4" />
                                            Great! You're in our standard service area.
                                        </div>
                                    )}
                                    {zipStatus === "surcharge" && (
                                        <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 p-3 rounded-xl animate-fade-in">
                                            <AlertTriangle className="h-4 w-4" />
                                            We serve your area with a $5 delivery surcharge.
                                        </div>
                                    )}
                                    {zipStatus === "invalid" && (
                                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl animate-fade-in">
                                            <AlertTriangle className="h-4 w-4" />
                                            Sorry, we don't serve this area yet.
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address" className="text-sm font-semibold">Full Address</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="123 Main St, Toledo, OH"
                                        className="h-12 border-2 focus:border-primary"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end pt-6">
                                <Button onClick={nextStep} className="h-12 px-8 gap-2 btn-premium gradient-primary border-0 shadow-lg hover:shadow-xl transition-all">
                                    Continue <ArrowRight className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Step 2: Services */}
                    {step === "services" && (
                        <Card className="animate-fade-in-up glass-card border-0 shadow-elevated-lg overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                                        <Package className="h-5 w-5 text-white" />
                                    </div>
                                    What are we cleaning?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <RadioGroup
                                    value={formData.selectedService}
                                    onValueChange={(value) => setFormData({ ...formData, selectedService: value })}
                                    className="space-y-3"
                                >
                                    {/* Student Special */}
                                    {(isStudentEligible || isStudentMode) && (
                                        <div className={cn(
                                            "relative flex items-center space-x-4 border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-md group",
                                            formData.selectedService === "student-special"
                                                ? "border-orange-400 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg shadow-orange-100"
                                                : "border-gray-200 hover:border-orange-200"
                                        )}>
                                            <RadioGroupItem value="student-special" id="student-special" />
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                                <GraduationCap className="h-6 w-6 text-white" />
                                            </div>
                                            <Label htmlFor="student-special" className="cursor-pointer flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-gray-900">Student Stuff-a-Bag</span>
                                                    <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">BGSU Special</Badge>
                                                </div>
                                                <p className="text-sm text-gray-500">Fill our bag for one flat rate</p>
                                            </Label>
                                            <span className="text-2xl font-bold gradient-text-orange">$25</span>
                                        </div>
                                    )}

                                    {/* Wash & Fold */}
                                    <div className={cn(
                                        "relative flex items-center space-x-4 border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-md group",
                                        formData.selectedService === "wash-fold"
                                            ? "border-primary bg-gradient-to-r from-blue-50 to-cyan-50 shadow-lg shadow-primary/10"
                                            : "border-gray-200 hover:border-primary/30"
                                    )}>
                                        <RadioGroupItem value="wash-fold" id="wash-fold" />
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                            <Shirt className="h-6 w-6 text-white" />
                                        </div>
                                        <Label htmlFor="wash-fold" className="cursor-pointer flex-1">
                                            <span className="font-bold text-gray-900 block mb-1">Wash & Fold</span>
                                            <p className="text-sm text-gray-500">Everyday laundry, towels, sheets</p>
                                        </Label>
                                        <span className="text-2xl font-bold gradient-text">$2/lb</span>
                                    </div>

                                    {/* Specialty */}
                                    <div className={cn(
                                        "relative flex items-center space-x-4 border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-md group",
                                        formData.selectedService === "specialty"
                                            ? "border-violet-400 bg-gradient-to-r from-violet-50 to-purple-50 shadow-lg shadow-violet-100"
                                            : "border-gray-200 hover:border-violet-200"
                                    )}>
                                        <RadioGroupItem value="specialty" id="specialty" />
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                            <Sparkles className="h-6 w-6 text-white" />
                                        </div>
                                        <Label htmlFor="specialty" className="cursor-pointer flex-1">
                                            <span className="font-bold text-gray-900 block mb-1">Specialty Items</span>
                                            <p className="text-sm text-gray-500">Comforters, dry cleaning, large items</p>
                                        </Label>
                                        <span className="text-lg font-bold text-violet-600">Flat Rate</span>
                                    </div>
                                </RadioGroup>

                                {/* Weight estimator for wash-fold */}
                                {formData.selectedService === "wash-fold" && (
                                    <div className="space-y-3 p-5 bg-gray-50 rounded-2xl border border-gray-100 animate-fade-in">
                                        <Label className="font-semibold">Estimated Weight (lbs)</Label>
                                        <Input
                                            type="number"
                                            value={formData.estimatedWeight}
                                            onChange={(e) => setFormData({ ...formData, estimatedWeight: parseInt(e.target.value) || 0 })}
                                            min={1}
                                            className="h-12 text-lg font-mono border-2"
                                        />
                                        <p className="text-sm text-gray-500">
                                            Minimum order: $30. You'll be charged for actual weight at pickup.
                                        </p>
                                    </div>
                                )}

                                {/* Specialty items selector */}
                                {formData.selectedService === "specialty" && (
                                    <div className="space-y-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 animate-fade-in">
                                        {services.filter(s => s.id !== "wash-fold").map(service => (
                                            <div key={service.id} className="flex items-center justify-between p-3 bg-white rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                                                        <service.icon className="h-4 w-4 text-violet-600" />
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-900">{service.name}</span>
                                                        <span className="text-sm text-gray-500 ml-2">${service.price} {service.unit}</span>
                                                    </div>
                                                </div>
                                                <Input
                                                    type="number"
                                                    className="w-20 h-10 text-center font-mono border-2"
                                                    value={formData.items[service.id] || 0}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        items: { ...formData.items, [service.id]: parseInt(e.target.value) || 0 }
                                                    })}
                                                    min={0}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="justify-between pt-6">
                                <Button variant="outline" onClick={prevStep} className="h-12 px-6 gap-2 border-2">
                                    <ArrowLeft className="h-4 w-4" /> Back
                                </Button>
                                <Button onClick={nextStep} className="h-12 px-8 gap-2 btn-premium gradient-primary border-0 shadow-lg hover:shadow-xl transition-all">
                                    Continue <ArrowRight className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Step 3: Schedule */}
                    {step === "schedule" && (
                        <Card className="animate-fade-in-up glass-card border-0 shadow-elevated-lg overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-white" />
                                    </div>
                                    When should we pick up?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="date" className="font-semibold">Pickup Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.pickupDate}
                                        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="h-12 text-lg border-2"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="font-semibold">Preferred Time</Label>
                                    <RadioGroup
                                        value={formData.pickupTime}
                                        onValueChange={(value) => setFormData({ ...formData, pickupTime: value })}
                                        className="grid grid-cols-3 gap-3"
                                    >
                                        {[
                                            { value: "morning", label: "Morning", time: "8am - 12pm", emoji: "🌅" },
                                            { value: "afternoon", label: "Afternoon", time: "12pm - 5pm", emoji: "☀️" },
                                            { value: "evening", label: "Evening", time: "5pm - 8pm", emoji: "🌙" },
                                        ].map((slot) => (
                                            <div
                                                key={slot.value}
                                                className={cn(
                                                    "relative border-2 rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 hover:shadow-md",
                                                    formData.pickupTime === slot.value
                                                        ? "border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg"
                                                        : "border-gray-200 hover:border-emerald-200"
                                                )}
                                                onClick={() => setFormData({ ...formData, pickupTime: slot.value })}
                                            >
                                                <RadioGroupItem value={slot.value} id={slot.value} className="sr-only" />
                                                <Label htmlFor={slot.value} className="cursor-pointer">
                                                    <span className="text-2xl block mb-2">{slot.emoji}</span>
                                                    <span className="block font-bold text-gray-900">{slot.label}</span>
                                                    <span className="text-sm text-gray-500">{slot.time}</span>
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="instructions" className="font-semibold">Special Instructions (optional)</Label>
                                    <Textarea
                                        id="instructions"
                                        placeholder="Gate code, doorbell doesn't work, leave by garage..."
                                        value={formData.specialInstructions}
                                        onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                                        className="min-h-24 border-2 resize-none"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="justify-between pt-6">
                                <Button variant="outline" onClick={prevStep} className="h-12 px-6 gap-2 border-2">
                                    <ArrowLeft className="h-4 w-4" /> Back
                                </Button>
                                <Button onClick={nextStep} className="h-12 px-8 gap-2 btn-premium gradient-primary border-0 shadow-lg hover:shadow-xl transition-all">
                                    Continue <ArrowRight className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Step 4: Review */}
                    {step === "review" && (
                        <Card className="animate-fade-in-up glass-card border-0 shadow-elevated-lg overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                                        <CreditCard className="h-5 w-5 text-white" />
                                    </div>
                                    Review Your Order
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    {/* Address */}
                                    <div className="flex justify-between items-start p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <MapPin className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Pickup Address</h4>
                                                <p className="text-gray-600 text-sm">{formData.address}</p>
                                                <p className="text-gray-500 text-sm">{formData.zipCode}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => setStep("location")} className="text-primary">Edit</Button>
                                    </div>

                                    {/* Service */}
                                    <div className="flex justify-between items-start p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                                                <Shirt className="h-4 w-4 text-violet-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Service</h4>
                                                <p className="text-gray-600 text-sm">
                                                    {formData.selectedService === "student-special" && "Student Stuff-a-Bag"}
                                                    {formData.selectedService === "wash-fold" && `Wash & Fold (~${formData.estimatedWeight} lbs)`}
                                                    {formData.selectedService === "specialty" && "Specialty Items"}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => setStep("services")} className="text-primary">Edit</Button>
                                    </div>

                                    {/* Schedule */}
                                    <div className="flex justify-between items-start p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                                <Calendar className="h-4 w-4 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Pickup Time</h4>
                                                <p className="text-gray-600 text-sm">
                                                    {formData.pickupDate} - {formData.pickupTime.charAt(0).toUpperCase() + formData.pickupTime.slice(1)}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => setStep("schedule")} className="text-primary">Edit</Button>
                                    </div>
                                </div>

                                <Separator />

                                {/* Pricing */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium">${(calculateTotal() - (zipStatus === "surcharge" ? SURCHARGE_AMOUNT : 0)).toFixed(2)}</span>
                                    </div>
                                    {zipStatus === "surcharge" && (
                                        <div className="flex justify-between text-amber-600">
                                            <span>Delivery Surcharge</span>
                                            <span className="font-medium">+${SURCHARGE_AMOUNT.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-3xl font-bold gradient-text">${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-between pt-6">
                                <Button variant="outline" onClick={prevStep} className="h-12 px-6 gap-2 border-2">
                                    <ArrowLeft className="h-4 w-4" /> Back
                                </Button>
                                <Button
                                    size="lg"
                                    className="h-14 px-8 gap-2 btn-premium bg-gradient-to-r from-orange-500 to-amber-500 border-0 shadow-xl hover:shadow-2xl transition-all text-lg"
                                    onClick={() => alert("Stripe checkout will be integrated here!")}
                                >
                                    <CreditCard className="h-5 w-5" />
                                    Pay ${calculateTotal().toFixed(2)}
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>}>
            <BookingContent />
        </Suspense>
    );
}
