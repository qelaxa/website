"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Phone, MapPin, Mail, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface ProfileData {
    full_name: string;
    email: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    role: string;
}

export default function ProfilePage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<ProfileData>({
        full_name: "",
        email: "",
        phone: "",
        address: { street: "", city: "", state: "", zip: "" },
        role: "customer"
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }
        if (user) {
            fetchProfile();
        }
    }, [user, authLoading]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();

            if (error) throw error;

            if (data) {
                setProfile({
                    full_name: data.full_name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    address: {
                        street: data.address?.street || "",
                        city: data.address?.city || "",
                        state: data.address?.state || "",
                        zip: data.address?.zip || ""
                    },
                    role: data.role || "customer"
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    phone: profile.phone,
                    address: profile.address
                })
                .eq('id', user?.id);

            if (error) throw error;
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 py-12 container mx-auto px-4 max-w-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-white">
                            {(profile.full_name || 'U').charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
                        <p className="text-gray-500 capitalize">{profile.role} Account</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <Card className="border-0 shadow-elevated-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" /> Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        value={profile.email}
                                        disabled
                                        className="pl-9 bg-gray-50"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Email cannot be changed.</p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="phone"
                                        placeholder="(555) 123-4567"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-elevated-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" /> Delivery Address
                            </CardTitle>
                            <CardDescription>
                                This will be used as your default pickup and delivery location.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="street">Street Address</Label>
                                <Input
                                    id="street"
                                    placeholder="123 Laundry Lane"
                                    value={profile.address.street}
                                    onChange={(e) => setProfile({
                                        ...profile,
                                        address: { ...profile.address, street: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        placeholder="San Francisco"
                                        value={profile.address.city}
                                        onChange={(e) => setProfile({
                                            ...profile,
                                            address: { ...profile.address, city: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        placeholder="CA"
                                        value={profile.address.state}
                                        onChange={(e) => setProfile({
                                            ...profile,
                                            address: { ...profile.address, state: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="zip">ZIP Code</Label>
                                <Input
                                    id="zip"
                                    placeholder="94105"
                                    value={profile.address.zip}
                                    onChange={(e) => setProfile({
                                        ...profile,
                                        address: { ...profile.address, zip: e.target.value }
                                    })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" className="w-full sm:w-auto btn-premium gradient-primary text-white shadow-lg" disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
}
