import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

// Generic read function
export async function readData<T>(filename: string, defaultData: T): Promise<T> {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);

    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data) as T;
    } catch {
        // File doesn't exist, return default and create it
        await writeData(filename, defaultData);
        return defaultData;
    }
}

// Generic write function
export async function writeData<T>(filename: string, data: T): Promise<void> {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Settings types and defaults
export interface BusinessSettings {
    name: string;
    tagline: string;
    email: string;
    phone: string;
    address: string;
}

export interface PricingSettings {
    washFoldPerLb: string;
    dryCleaningBase: string;
    expressMultiplier: string;
    studentDiscount: string;
    deliveryFee: string;
    freeDeliveryThreshold: string;
}

export interface DeliverySettings {
    standardZips: string;
    extendedZips: string;
}

export interface NotificationSettings {
    emailNewOrders: boolean;
    emailStatusUpdates: boolean;
    smsAlerts: boolean;
}

export interface Settings {
    business: BusinessSettings;
    pricing: PricingSettings;
    delivery: DeliverySettings;
    notifications: NotificationSettings;
}

export const defaultSettings: Settings = {
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

// Order types
export interface Order {
    id: string;
    customer: string;
    email: string;
    service: string;
    status: string;
    total: string;
    date: string;
    time: string;
}

export const defaultOrders: Order[] = [
    { id: "LQ-2849", customer: "Sarah Johnson", email: "sarah.j@email.com", service: "Wash & Fold (25lbs)", status: "In Progress", total: "$55.00", date: "Dec 30, 2024", time: "2:30 PM" },
    { id: "LQ-2848", customer: "Mike Chen", email: "mike.c@email.com", service: "Student Special", status: "Picked Up", total: "$25.00", date: "Dec 30, 2024", time: "1:15 PM" },
    { id: "LQ-2847", customer: "Emily Davis", email: "emily.d@email.com", service: "Comforter (King)", status: "Delivered", total: "$25.00", date: "Dec 30, 2024", time: "11:00 AM" },
    { id: "LQ-2846", customer: "James Wilson", email: "james.w@email.com", service: "Wash & Fold (40lbs)", status: "Washing", total: "$80.00", date: "Dec 29, 2024", time: "4:45 PM" },
    { id: "LQ-2845", customer: "Jessica Brown", email: "jessica.b@email.com", service: "Dry Cleaning (3)", status: "Completed", total: "$45.00", date: "Dec 29, 2024", time: "3:00 PM" },
];

// Customer types
export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    orders: number;
    spent: string;
    status: string;
    joined: string;
}

export const defaultCustomers: Customer[] = [
    { id: 1, name: "Sarah Johnson", email: "sarah.j@email.com", phone: "(419) 555-0101", address: "123 Oak St, Toledo, OH", orders: 12, spent: "$540.00", status: "Active", joined: "Oct 2024" },
    { id: 2, name: "Mike Chen", email: "mike.c@email.com", phone: "(419) 555-0102", address: "456 Elm Ave, Bowling Green, OH", orders: 8, spent: "$320.00", status: "Active", joined: "Nov 2024" },
    { id: 3, name: "Emily Davis", email: "emily.d@email.com", phone: "(419) 555-0103", address: "789 Pine Rd, Perrysburg, OH", orders: 5, spent: "$180.00", status: "Active", joined: "Dec 2024" },
    { id: 4, name: "James Wilson", email: "james.w@email.com", phone: "(419) 555-0104", address: "321 Maple Dr, Maumee, OH", orders: 15, spent: "$720.00", status: "VIP", joined: "Sep 2024" },
    { id: 5, name: "Jessica Brown", email: "jessica.b@email.com", phone: "(419) 555-0105", address: "654 Cedar Ln, Sylvania, OH", orders: 3, spent: "$95.00", status: "New", joined: "Dec 2024" },
];
