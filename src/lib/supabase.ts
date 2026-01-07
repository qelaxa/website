import { createBrowserClient, SupabaseClient } from '@supabase/ssr'

// Singleton instance - shared across all components
let supabaseInstance: SupabaseClient | null = null;

export const createClient = () => {
    // Return existing instance if available (singleton pattern)
    if (supabaseInstance) {
        return supabaseInstance;
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.error("Supabase environment variables are missing!");
    } else {
        console.log("Supabase Client initializing with URL:", url);
    }

    supabaseInstance = createBrowserClient(url!, key!);
    return supabaseInstance;
}
