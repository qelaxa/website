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

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
        }

        const users = await readData<StoredUser[]>(USERS_FILE, []);

        // Check if email already exists
        if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
            return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        }

        // Create new user
        const newUser: StoredUser = {
            id: `user-${Date.now()}`,
            email: email.toLowerCase(),
            name,
            password,
            role: "customer",
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        await writeData(USERS_FILE, users);

        // Return user without password
        const { password: _, ...safeUser } = newUser;
        return NextResponse.json({ user: safeUser });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}
