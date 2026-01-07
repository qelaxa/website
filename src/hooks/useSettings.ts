"use client";

import { useState, useEffect } from 'react';

export interface Settings {
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

// Default settings (fallback)
const defaultSettings: Settings = {
    business: {
        name: "LEQAXA Laundry",
        tagline: "Effortlessly Pristine",
        email: "hello@leqaxa.com",
        phone: "(419) 555-0100",
        address: "123 Main St, Toledo, OH 43604",
    },
    pricing: {
        washFoldPerLb: "2.00",
        dryCleaningBase: "15.00",
        expressMultiplier: "1.5",
        studentDiscount: "15",
        deliveryFee: "5.00",
        freeDeliveryThreshold: "50.00",
    },
    delivery: {
        standardZips: "43604, 43605, 43606, 43607, 43608, 43609, 43610, 43611, 43612",
        extendedZips: "43551, 43560, 43615, 43617",
    },
    notifications: {
        emailNewOrders: true,
        emailStatusUpdates: true,
        smsAlerts: false,
    },
};

// Hook to fetch settings
export function useSettings() {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings');
                if (!res.ok) throw new Error('Failed to fetch settings');
                const data = await res.json();
                setSettings(data);
            } catch (err) {
                console.error('Error fetching settings:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                // Keep using defaults
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    return { settings, loading, error };
}

// Helper function to check if a ZIP code is in service area
export function checkZipCode(zip: string, settings: Settings): {
    isServiceable: boolean;
    zone: 'standard' | 'extended' | 'outside';
    surcharge: number;
} {
    const standardZips = settings.delivery.standardZips.split(',').map(z => z.trim());
    const extendedZips = settings.delivery.extendedZips.split(',').map(z => z.trim());

    if (standardZips.includes(zip)) {
        return { isServiceable: true, zone: 'standard', surcharge: 0 };
    }
    if (extendedZips.includes(zip)) {
        return { isServiceable: true, zone: 'extended', surcharge: 5 };
    }
    return { isServiceable: false, zone: 'outside', surcharge: 0 };
}

export { defaultSettings };
