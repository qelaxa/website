import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.error("Supabase environment variables are missing!");
        if (typeof window !== 'undefined') alert("CRITICAL ERROR: Supabase Keys Missing! Check Vercel Env Vars.");
    } else {
        console.log("Supabase Client initializing with URL:", url);
        // Temporary Debug: Verify connection on load
        if (typeof window !== 'undefined' && !window.localStorage.getItem('debug_alert_shown')) {
            console.log("Supabase initialized");
            // window.localStorage.setItem('debug_alert_shown', 'true');
        }
    }

    return createBrowserClient(url!, key!);
}
