"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Camera, Upload, Send, CheckCircle, Droplets, AlertTriangle, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const stainTypes = [
    { id: "coffee", name: "Coffee/Tea", icon: "☕", difficulty: "Easy", color: "from-amber-400 to-amber-600" },
    { id: "wine", name: "Red Wine", icon: "🍷", difficulty: "Medium", color: "from-red-400 to-red-600" },
    { id: "oil", name: "Oil/Grease", icon: "🫒", difficulty: "Medium", color: "from-yellow-400 to-yellow-600" },
    { id: "ink", name: "Ink/Pen", icon: "🖊️", difficulty: "Hard", color: "from-blue-400 to-blue-600" },
    { id: "blood", name: "Blood", icon: "🩸", difficulty: "Medium", color: "from-rose-400 to-rose-600" },
    { id: "grass", name: "Grass", icon: "🌿", difficulty: "Easy", color: "from-green-400 to-green-600" },
    { id: "makeup", name: "Makeup", icon: "💄", difficulty: "Medium", color: "from-pink-400 to-pink-600" },
    { id: "other", name: "Other", icon: "❓", difficulty: "Varies", color: "from-gray-400 to-gray-600" },
];

const difficultyColors: Record<string, string> = {
    "Easy": "bg-emerald-100 text-emerald-700",
    "Medium": "bg-amber-100 text-amber-700",
    "Hard": "bg-red-100 text-red-700",
    "Varies": "bg-gray-100 text-gray-700",
};

export default function StainConciergePage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [stainType, setStainType] = useState<string | null>(null);
    const [fabric, setFabric] = useState("");
    const [description, setDescription] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        // TODO: Upload to Supabase storage and create stain request
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 flex items-center justify-center py-12 relative overflow-hidden">
                    <div className="absolute inset-0 gradient-mesh" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[600px] h-[600px] bg-emerald-200/30 rounded-full blur-3xl animate-pulse" />
                    </div>

                    <Card className="max-w-md text-center border-0 shadow-elevated-lg glass-card animate-scale-in relative z-10 overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
                        <CardContent className="pt-10 pb-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce-subtle">
                                <CheckCircle className="h-10 w-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3 text-gray-900">Request Submitted!</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Our stain experts will review your request and provide treatment recommendations within <span className="font-semibold text-emerald-600">24 hours</span>.
                            </p>
                            <Button asChild className="h-12 px-8 btn-premium gradient-primary border-0 shadow-lg hover:shadow-xl transition-all group">
                                <a href="/" className="gap-2">
                                    Return Home
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 py-12 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 gradient-mesh" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
                <div className="absolute inset-0 pattern-dots opacity-20" />

                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    {/* Header */}
                    <div className="text-center mb-10 animate-fade-in-up">
                        <Badge className="mb-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-600 border-violet-200">
                            <Sparkles className="h-3 w-3 mr-1" /> Expert Care
                        </Badge>
                        <h1 className="heading-lg text-gray-900 mb-3">
                            Stain <span className="gradient-text">Concierge</span>
                        </h1>
                        <p className="text-gray-600 max-w-lg mx-auto text-lg">
                            Got a tough stain? Send us a photo and our experts will recommend the best treatment—or let you know if professional care is needed.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Upload Section */}
                        <Card className="border-0 shadow-card glass-card overflow-hidden animate-fade-in-up">
                            <div className="h-1 bg-gradient-to-r from-primary to-cyan-500" />
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-md">
                                        <Camera className="h-5 w-5 text-white" />
                                    </div>
                                    Upload Photo
                                </CardTitle>
                                <CardDescription>
                                    Take a clear photo of the stain for best results
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {preview ? (
                                        <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-inner">
                                            <Image
                                                src={preview}
                                                alt="Stain preview"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="absolute bottom-4 right-4 shadow-lg"
                                                onClick={() => {
                                                    setPreview(null);
                                                    setSelectedFile(null);
                                                }}
                                            >
                                                Change Photo
                                            </Button>
                                        </div>
                                    ) : (
                                        <label
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            className={cn(
                                                "flex flex-col items-center justify-center aspect-square rounded-2xl cursor-pointer transition-all duration-300",
                                                isDragging
                                                    ? "border-primary bg-primary/5 border-2 border-dashed"
                                                    : "border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all",
                                                isDragging
                                                    ? "bg-primary text-white scale-110"
                                                    : "bg-gray-200 text-gray-500"
                                            )}>
                                                <Upload className="h-8 w-8" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600 mb-1">
                                                {isDragging ? "Drop your image here" : "Click to upload or drag and drop"}
                                            </span>
                                            <span className="text-xs text-gray-400">PNG, JPG up to 10MB</span>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Details Section */}
                        <Card className="border-0 shadow-card glass-card overflow-hidden animate-fade-in-up delay-100">
                            <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                                        <Droplets className="h-5 w-5 text-white" />
                                    </div>
                                    Stain Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Stain Type */}
                                <div className="space-y-3">
                                    <Label className="font-semibold">What type of stain is it?</Label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {stainTypes.map((type) => (
                                            <button
                                                key={type.id}
                                                onClick={() => setStainType(type.id)}
                                                className={cn(
                                                    "relative p-3 rounded-xl border-2 text-center transition-all duration-300 group",
                                                    stainType === type.id
                                                        ? "border-violet-400 bg-violet-50 shadow-lg"
                                                        : "border-gray-200 hover:border-violet-200 hover:bg-gray-50"
                                                )}
                                            >
                                                <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">{type.icon}</span>
                                                <span className="text-xs text-gray-600 font-medium">{type.name}</span>
                                                {stainType === type.id && (
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
                                                        <CheckCircle className="h-3 w-3 text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    {stainType && (
                                        <div className="flex items-center gap-2 animate-fade-in">
                                            <span className="text-sm text-gray-600">Difficulty:</span>
                                            <Badge className={difficultyColors[stainTypes.find(t => t.id === stainType)?.difficulty || "Varies"]}>
                                                {stainTypes.find(t => t.id === stainType)?.difficulty}
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                {/* Fabric Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="fabric" className="font-semibold">What type of fabric?</Label>
                                    <Input
                                        id="fabric"
                                        value={fabric}
                                        onChange={(e) => setFabric(e.target.value)}
                                        placeholder="e.g., Cotton shirt, Silk blouse, Wool sweater..."
                                        className="h-12 border-2 focus:border-violet-400"
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="font-semibold">Additional Details</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="How long has the stain been there? Have you tried treating it? Any other details..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        className="border-2 focus:border-violet-400 resize-none"
                                    />
                                </div>

                                {/* Warning */}
                                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-amber-800">Pro Tip</p>
                                        <p className="text-sm text-amber-700">Don't heat-dry stained items! Heat can set stains permanently.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Separator className="my-10" />

                    <div className="flex justify-center animate-fade-in-up delay-200">
                        <Button
                            size="lg"
                            className="h-14 px-10 text-lg gap-3 btn-premium bg-gradient-to-r from-violet-500 to-purple-600 border-0 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                            onClick={handleSubmit}
                            disabled={!preview || !stainType}
                        >
                            <Send className="h-5 w-5" />
                            Submit for Expert Review
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
