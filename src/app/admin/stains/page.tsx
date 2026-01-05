"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowUpRight, Check, X, Sparkles, MessageSquare } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface StainRequest {
    id: string;
    stain_type: string;
    fabric: string;
    description: string;
    image_url: string;
    status: string;
    expert_notes: string;
    created_at: string;
    profiles: {
        full_name: string;
        email: string;
    };
}

export default function AdminStainsPage() {
    const [requests, setRequests] = useState<StainRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [notes, setNotes] = useState<Record<string, string>>({});
    const supabase = createClient();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data, error } = await supabase
                .from('stain_requests')
                .select('*, profiles(full_name, email)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);

            // Initialize notes state
            const initialNotes: Record<string, string> = {};
            data?.forEach((req: StainRequest) => {
                if (req.expert_notes) initialNotes[req.id] = req.expert_notes;
            });
            setNotes(initialNotes);
        } catch (error) {
            console.error("Error fetching stains:", error);
            toast.error("Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
            const { error } = await supabase
                .from('stain_requests')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
            toast.success("Status updated");
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    const saveNotes = async (id: string) => {
        setUpdatingId(id);
        try {
            const { error } = await supabase
                .from('stain_requests')
                .update({ expert_notes: notes[id] })
                .eq('id', id);

            if (error) throw error;
            toast.success("Notes saved");
        } catch (error) {
            toast.error("Failed to save notes");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-teal-500" /></div>;

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Stain Concierge Requests</h1>
                    <p className="text-gray-500 mt-1">Review and providing expert advice for customer stains.</p>
                </div>
            </div>

            <div className="grid gap-6">
                {requests.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 bg-white rounded-xl">No requests found</div>
                ) : requests.map((req) => (
                    <Card key={req.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                                {/* Image Section */}
                                <div className="md:w-1/3 h-64 md:h-auto relative bg-gray-100">
                                    {req.image_url ? (
                                        <Image
                                            src={req.image_url}
                                            alt="Stain"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <Badge className={
                                            req.status === 'completed' ? 'bg-emerald-500' :
                                                req.status === 'analyzed' ? 'bg-blue-500' : 'bg-orange-500'
                                        }>
                                            {req.status}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Details Section */}
                                <div className="flex-1 p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{req.stain_type} Stain on {req.fabric}</h3>
                                            <p className="text-sm text-gray-500">Submitted by {req.profiles?.full_name || 'Unknown'} • {new Date(req.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-700 italic">"{req.description}"</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-violet-500" />
                                            Expert Recommendations
                                        </label>
                                        <div className="flex gap-2">
                                            <Textarea
                                                value={notes[req.id] || ''}
                                                onChange={(e) => setNotes({ ...notes, [req.id]: e.target.value })}
                                                placeholder="Enter treatment advice..."
                                                className="min-h-[80px]"
                                            />
                                            <Button
                                                onClick={() => saveNotes(req.id)}
                                                disabled={updatingId === req.id}
                                                className="h-auto w-20"
                                                variant="secondary"
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        {req.status === 'pending' && (
                                            <Button
                                                onClick={() => updateStatus(req.id, 'analyzed')}
                                                disabled={updatingId === req.id}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                Mark Analyzed
                                            </Button>
                                        )}
                                        {req.status !== 'completed' && (
                                            <Button
                                                onClick={() => updateStatus(req.id, 'completed')}
                                                disabled={updatingId === req.id}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                            >
                                                Mark Resolved
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
