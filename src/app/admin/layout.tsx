"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ProtectedRoute } from "@/contexts/AuthContext";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute adminOnly>
            <div className="min-h-screen bg-gray-50/50">
                <AdminSidebar />

                {/* Main Content */}
                <main className="lg:ml-64 min-h-screen relative">
                    <div className="absolute inset-0 bg-slate-50/50" />
                    <div className="p-6 lg:p-8 relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
