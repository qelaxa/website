import { NextResponse } from 'next/server';
import { readData, writeData, Settings, defaultSettings } from '@/lib/storage';

const SETTINGS_FILE = 'settings.json';

export async function GET() {
    try {
        const settings = await readData<Settings>(SETTINGS_FILE, defaultSettings);
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error reading settings:', error);
        return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const settings = await request.json() as Settings;
        await writeData(SETTINGS_FILE, settings);
        return NextResponse.json({ success: true, message: 'Settings saved successfully' });
    } catch (error) {
        console.error('Error saving settings:', error);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
