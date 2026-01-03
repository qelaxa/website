"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Store,
    Bell,
    Shield,
    CreditCard,
    Truck,
    Mail,
    Save,
    MessageSquare,
    Loader2,
    CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

interface Settings {
    business: {
        name: string;
        tagline: string;
        email: string;
        phone: string;
        address: string;
    };
    pricing: {
        washFoldPerLb: string;
        dryCleaningBase: string;
        expressMultiplier: string;
        studentDiscount: string;
        deliveryFee: string;
        freeDeliveryThreshold: string;
    };
    delivery: {
        standardZips: string;
        extendedZips: string;
    };
    notifications: {
        emailNewOrders: boolean;
        emailStatusUpdates: boolean;
        smsAlerts: boolean;
    };
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Load settings on mount
    useEffect(() => {
        async function loadSettings() {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                setSettings(data);
            } catch (error) {
                console.error('Failed to load settings:', error);
            } finally {
                setLoading(false);
            }
        }
        loadSettings();
    }, []);

    // Save settings
    async function saveSettings() {
        if (!settings) return;

        setSaving(true);
        setSaved(false);

        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error('Failed to save settings:', error);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Failed to load settings</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500">Manage your business configuration</p>
                </div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <Badge className="bg-emerald-100 text-emerald-700 gap-1.5">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Saved!
                        </Badge>
                    )}
                    <Button
                        onClick={saveSettings}
                        disabled={saving}
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg gap-2"
                    >
                        {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {saving ? 'Saving...' : 'Save All Changes'}
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Business Information */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                                <Store className="h-5 w-5 text-teal-500" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Business Information</CardTitle>
                                <CardDescription>Your business details</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="business-name">Business Name</Label>
                            <Input
                                id="business-name"
                                value={settings.business.name}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    business: { ...settings.business, name: e.target.value }
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tagline">Tagline</Label>
                            <Input
                                id="tagline"
                                value={settings.business.tagline}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    business: { ...settings.business, tagline: e.target.value }
                                })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={settings.business.email}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        business: { ...settings.business, email: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={settings.business.phone}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        business: { ...settings.business, phone: e.target.value }
                                    })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={settings.business.address}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    business: { ...settings.business, address: e.target.value }
                                })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing Configuration */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Pricing Configuration</CardTitle>
                                <CardDescription>Set your service prices</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="wash-fold">Wash & Fold (per lb)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                    <Input
                                        id="wash-fold"
                                        className="pl-7"
                                        value={settings.pricing.washFoldPerLb}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            pricing: { ...settings.pricing, washFoldPerLb: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dry-cleaning">Dry Cleaning Base</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                    <Input
                                        id="dry-cleaning"
                                        className="pl-7"
                                        value={settings.pricing.dryCleaningBase}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            pricing: { ...settings.pricing, dryCleaningBase: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="express">Express Multiplier</Label>
                                <Input
                                    id="express"
                                    value={settings.pricing.expressMultiplier}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        pricing: { ...settings.pricing, expressMultiplier: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="student">Student Discount (%)</Label>
                                <Input
                                    id="student"
                                    value={settings.pricing.studentDiscount}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        pricing: { ...settings.pricing, studentDiscount: e.target.value }
                                    })}
                                />
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="delivery">Delivery Fee</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                    <Input
                                        id="delivery"
                                        className="pl-7"
                                        value={settings.pricing.deliveryFee}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            pricing: { ...settings.pricing, deliveryFee: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="free-threshold">Free Delivery Above</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                    <Input
                                        id="free-threshold"
                                        className="pl-7"
                                        value={settings.pricing.freeDeliveryThreshold}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            pricing: { ...settings.pricing, freeDeliveryThreshold: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Delivery Zones */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Truck className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Delivery Zones</CardTitle>
                                <CardDescription>Manage service areas</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Standard Zone ZIP Codes</Label>
                            <Input
                                placeholder="43604, 43605, 43606..."
                                value={settings.delivery.standardZips}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    delivery: { ...settings.delivery, standardZips: e.target.value }
                                })}
                            />
                            <p className="text-xs text-gray-500">No surcharge applied</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Extended Zone ZIP Codes</Label>
                            <Input
                                placeholder="43551, 43615..."
                                value={settings.delivery.extendedZips}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    delivery: { ...settings.delivery, extendedZips: e.target.value }
                                })}
                            />
                            <p className="text-xs text-gray-500">$5 surcharge applied</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                <Bell className="h-5 w-5 text-orange-500" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Notifications</CardTitle>
                                <CardDescription>Configure alerts</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">New Order Emails</p>
                                    <p className="text-sm text-gray-500">Get notified for new orders</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.notifications.emailNewOrders}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    notifications: { ...settings.notifications, emailNewOrders: e.target.checked }
                                })}
                                className="h-5 w-5 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">Status Update Emails</p>
                                    <p className="text-sm text-gray-500">Order status changes</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.notifications.emailStatusUpdates}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    notifications: { ...settings.notifications, emailStatusUpdates: e.target.checked }
                                })}
                                className="h-5 w-5 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">SMS Alerts</p>
                                    <p className="text-sm text-gray-500">Urgent notifications via SMS</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.notifications.smsAlerts}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    notifications: { ...settings.notifications, smsAlerts: e.target.checked }
                                })}
                                className="h-5 w-5 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
