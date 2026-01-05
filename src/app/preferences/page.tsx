"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Droplets, ThermometerSun, Shirt, Sparkles, Save, Check, Leaf, Wind, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useEffect } from "react";
// ... other imports

export default function PreferencesPage() {
    const supabase = createClient();
    const [preferences, setPreferences] = useState({
        detergent: "eco-friendly",
        temperature: "cold",
        foldingStyle: "standard",
        hangDryItems: false,
        fabricSoftener: true,
        bleachWhites: false,
        specialInstructions: "",
    });

    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPreferences() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('preferences')
                        .eq('id', user.id)
                        .single();

                    if (profile?.preferences && Object.keys(profile.preferences).length > 0) {
                        setPreferences(prev => ({ ...prev, ...profile.preferences }));
                    }
                }
            } catch (error) {
                console.error("Error loading preferences:", error);
            } finally {
                setLoading(false);
            }
        }
        loadPreferences();
    }, []);

    const handleSave = async () => {
        setSaved(false);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("Please log in to save preferences.");
                return;
            }

            const { error } = await supabase
                .from('profiles')
                .update({ preferences: preferences })
                .eq('id', user.id);

            if (error) throw error;

            setSaved(true);
            toast.success("Preferences saved!");
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error("Error saving:", error);
            toast.error("Failed to save preferences");
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 py-12 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 gradient-mesh" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
                <div className="absolute inset-0 pattern-dots opacity-20" />

                <div className="container mx-auto px-4 max-w-3xl relative z-10">
                    {/* Header */}
                    <div className="text-center mb-10 animate-fade-in-up">
                        <Badge className="mb-4 bg-primary/10 text-primary border-0">
                            <Sparkles className="h-3 w-3 mr-1" /> Personalize
                        </Badge>
                        <h1 className="heading-lg text-gray-900 mb-2">
                            Care <span className="gradient-text">Menu</span>
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Customize how we handle your laundry. These preferences apply to all orders.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Detergent */}
                        <Card className="border-0 shadow-card glass-card overflow-hidden animate-fade-in-up">
                            <div className="h-1 bg-gradient-to-r from-primary to-cyan-500" />
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-md">
                                        <Droplets className="h-5 w-5 text-white" />
                                    </div>
                                    Detergent Type
                                </CardTitle>
                                <CardDescription>
                                    Choose your preferred detergent for everyday laundry
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={preferences.detergent}
                                    onValueChange={(value) => setPreferences({ ...preferences, detergent: value })}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                >
                                    {[
                                        { value: "eco-friendly", label: "Eco-Friendly", description: "Plant-based, fragrance-free", icon: Leaf, color: "emerald" },
                                        { value: "scented", label: "Fresh Scented", description: "Light, clean fragrance", icon: Wind, color: "blue" },
                                        { value: "hypoallergenic", label: "Hypoallergenic", description: "Sensitive skin formula", icon: Sparkles, color: "violet" },
                                    ].map((option) => (
                                        <div
                                            key={option.value}
                                            className={cn(
                                                "relative flex flex-col items-center text-center border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-md group",
                                                preferences.detergent === option.value
                                                    ? `border-${option.color}-400 bg-${option.color}-50 shadow-lg`
                                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                            )}
                                            onClick={() => setPreferences({ ...preferences, detergent: option.value })}
                                        >
                                            <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110",
                                                preferences.detergent === option.value
                                                    ? `bg-${option.color}-500 text-white shadow-lg`
                                                    : "bg-gray-100 text-gray-500"
                                            )}>
                                                <option.icon className="h-5 w-5" />
                                            </div>
                                            <Label htmlFor={option.value} className="cursor-pointer">
                                                <span className="font-bold text-gray-900 block">{option.label}</span>
                                                <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                                            </Label>
                                            {preferences.detergent === option.value && (
                                                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        {/* Temperature */}
                        <Card className="border-0 shadow-card glass-card overflow-hidden animate-fade-in-up delay-100">
                            <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                                        <ThermometerSun className="h-5 w-5 text-white" />
                                    </div>
                                    Water Temperature
                                </CardTitle>
                                <CardDescription>
                                    Default temperature for washing (unless care labels indicate otherwise)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={preferences.temperature}
                                    onValueChange={(value) => setPreferences({ ...preferences, temperature: value })}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                >
                                    {[
                                        { value: "cold", label: "Cold", description: "Energy-efficient, gentle", emoji: "❄️", color: "bg-blue-500" },
                                        { value: "warm", label: "Warm", description: "Balanced cleaning", emoji: "🌤️", color: "bg-amber-500" },
                                        { value: "hot", label: "Hot", description: "Deep sanitization", emoji: "🔥", color: "bg-red-500" },
                                    ].map((option) => (
                                        <div
                                            key={option.value}
                                            className={cn(
                                                "relative flex flex-col items-center text-center border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-md",
                                                preferences.temperature === option.value
                                                    ? "border-violet-400 bg-violet-50 shadow-lg"
                                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                            )}
                                            onClick={() => setPreferences({ ...preferences, temperature: option.value })}
                                        >
                                            <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                                            <span className="text-3xl mb-2">{option.emoji}</span>
                                            <Label htmlFor={option.value} className="cursor-pointer">
                                                <span className="font-bold text-gray-900 block">{option.label}</span>
                                                <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                                            </Label>
                                            {preferences.temperature === option.value && (
                                                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        {/* Folding Style */}
                        <Card className="border-0 shadow-card glass-card overflow-hidden animate-fade-in-up delay-200">
                            <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                                        <Shirt className="h-5 w-5 text-white" />
                                    </div>
                                    Folding Style
                                </CardTitle>
                                <CardDescription>
                                    How would you like your clothes organized?
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={preferences.foldingStyle}
                                    onValueChange={(value) => setPreferences({ ...preferences, foldingStyle: value })}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    {[
                                        { value: "standard", label: "Standard Fold", description: "Neatly folded, sorted by type", emoji: "📦" },
                                        { value: "hang", label: "Hang Preferred", description: "Shirts & pants on hangers", emoji: "👔" },
                                    ].map((option) => (
                                        <div
                                            key={option.value}
                                            className={cn(
                                                "relative flex items-center gap-4 border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-md",
                                                preferences.foldingStyle === option.value
                                                    ? "border-emerald-400 bg-emerald-50 shadow-lg"
                                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                            )}
                                            onClick={() => setPreferences({ ...preferences, foldingStyle: option.value })}
                                        >
                                            <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                                            <span className="text-3xl">{option.emoji}</span>
                                            <Label htmlFor={option.value} className="cursor-pointer flex-1">
                                                <span className="font-bold text-gray-900 block">{option.label}</span>
                                                <p className="text-sm text-gray-500">{option.description}</p>
                                            </Label>
                                            {preferences.foldingStyle === option.value && (
                                                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                                    <Check className="h-3 w-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        {/* Extra Options */}
                        <Card className="border-0 shadow-card glass-card overflow-hidden animate-fade-in-up delay-300">
                            <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
                                        <Sparkles className="h-5 w-5 text-white" />
                                    </div>
                                    Extra Options
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { id: "softener", label: "Use fabric softener", checked: preferences.fabricSoftener, key: "fabricSoftener" },
                                    { id: "hangDry", label: "Hang dry delicate items", checked: preferences.hangDryItems, key: "hangDryItems" },
                                    { id: "bleach", label: "Use bleach on whites when appropriate", checked: preferences.bleachWhites, key: "bleachWhites" },
                                ].map((option) => (
                                    <div
                                        key={option.id}
                                        className={cn(
                                            "flex items-center space-x-4 p-4 rounded-xl border-2 transition-all cursor-pointer",
                                            option.checked
                                                ? "border-orange-200 bg-orange-50"
                                                : "border-gray-100 bg-white hover:bg-gray-50"
                                        )}
                                        onClick={() => setPreferences({ ...preferences, [option.key]: !option.checked })}
                                    >
                                        <Checkbox
                                            id={option.id}
                                            checked={option.checked}
                                            onCheckedChange={(checked) => setPreferences({ ...preferences, [option.key]: !!checked })}
                                            className="h-5 w-5"
                                        />
                                        <Label htmlFor={option.id} className="cursor-pointer flex-1 font-medium">
                                            {option.label}
                                        </Label>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Special Instructions */}
                        <Card className="border-0 shadow-card glass-card overflow-hidden animate-fade-in-up delay-400">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg">Special Instructions</CardTitle>
                                <CardDescription>
                                    Any additional notes for our team? (allergies, specific item care, etc.)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="E.g., My red sweater should be washed separately, I'm allergic to certain fragrances..."
                                    value={preferences.specialInstructions}
                                    onChange={(e) => setPreferences({ ...preferences, specialInstructions: e.target.value })}
                                    rows={4}
                                    className="border-2 focus:border-primary resize-none"
                                />
                            </CardContent>
                        </Card>

                        <Separator className="my-8" />

                        {/* Save Button */}
                        <div className="flex justify-end gap-4 animate-fade-in-up delay-500">
                            <Button variant="outline" className="h-12 px-6 border-2">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                className={cn(
                                    "h-12 px-8 gap-2 btn-premium border-0 shadow-lg transition-all duration-300",
                                    saved
                                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                        : "gradient-primary hover:shadow-xl hover:-translate-y-0.5"
                                )}
                            >
                                {saved ? (
                                    <>
                                        <Check className="h-5 w-5" />
                                        Saved!
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Preferences
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
