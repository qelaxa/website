import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/storage";

interface StoredUser {
    id: string;
    email: string;
    name: string;
    password: string;
    phone?: string;
    address?: string;
    role: "customer" | "admin";
    createdAt: string;
}

const USERS_FILE = "users.json";

const defaultUsers: StoredUser[] = [
    {
        id: "admin-1",
        email: "admin@leqaxa.com",
        name: "Admin User",
        password: "admin123",
        role: "admin",
        createdAt: new Date().toISOString(),
    },
    {
        id: "demo-1",
        email: "demo@example.com",
        name: "Demo User",
        password: "demo123",
        phone: "(419) 555-0100",
        address: "123 Main St, Toledo, OH",
        role: "customer",
        createdAt: new Date().toISOString(),
    },
];

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const users = await readData<StoredUser[]>(USERS_FILE, defaultUsers);
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // Return user without password
        const { password: _, ...safeUser } = user;
        return NextResponse.json({ user: safeUser });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}
