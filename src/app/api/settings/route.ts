import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Default settings (used if no settings in DB)
const defaultSettings = {
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

// Create Supabase client for API route
function getSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, key);
}

export async function GET() {
    try {
        const supabase = getSupabaseClient();

        // Try to get settings from Supabase
        const { data, error } = await supabase
            .from('app_settings')
            .select('*')
            .eq('key', 'site_settings')
            .single();

        if (error || !data) {
            // Return defaults if no settings found
            return NextResponse.json(defaultSettings);
        }

        return NextResponse.json(data.value);
    } catch (error) {
        console.error('Error reading settings:', error);
        return NextResponse.json(defaultSettings);
    }
}

export async function POST(request: Request) {
    try {
        const settings = await request.json();
        const supabase = getSupabaseClient();

        // Upsert settings (insert if not exists, update if exists)
        const { error } = await supabase
            .from('app_settings')
            .upsert({
                key: 'site_settings',
                value: settings,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'key'
            });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Settings saved successfully' });
    } catch (error) {
        console.error('Error saving settings:', error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
