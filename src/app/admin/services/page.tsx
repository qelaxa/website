"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, Edit2, Archive, DollarSign, Shirt, Sparkles, Bed } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const INITIAL_SERVICES = [
    { id: "wash-fold", name: "Wash & Fold", category: "Standard", price: 2.00, unit: "/lb", isActive: true, icon: Shirt },
    { id: "student-special", name: "Student Stuff-a-Bag", category: "Deals", price: 25.00, unit: "flat", isActive: true, icon: Sparkles },
    { id: "comforter-king", name: "Comforter (King/Queen)", category: "Specialty", price: 20.00, unit: "each", isActive: true, icon: Bed },
    { id: "comforter-twin", name: "Comforter (Twin/Full)", category: "Specialty", price: 15.00, unit: "each", isActive: true, icon: Bed },
    { id: "dry-clean-shirt", name: "Dry Clean (Shirt)", category: "Dry Cleaning", price: 8.00, unit: "item", isActive: true, icon: Shirt },
];

export default function ServiceManagementPage() {
    const [services, setServices] = useState(INITIAL_SERVICES);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (service: any) => {
        setEditingService({ ...service });
        setIsEditOpen(true);
    };

    const handleSave = () => {
        setServices(services.map(s => s.id === editingService.id ? editingService : s));
        setIsEditOpen(false);
        setEditingService(null);
    };

    const handleToggleStatus = (id: string) => {
        setServices(services.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Services & Pricing</h1>
                    <p className="text-gray-500 mt-1">Manage your service offerings and pricing structure.</p>
                </div>
                <Button className="btn-premium gradient-primary shadow-lg hover:shadow-xl">
                    <Plus className="h-4 w-4 mr-2" /> Add New Service
                </Button>
            </div>

            <Card className="border-0 shadow-elevated-lg glass-card overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-6 py-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-white text-gray-600 border-gray-200">
                                {services.length} Services
                            </Badge>
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-100">
                                {services.filter(s => s.isActive).length} Active
                            </Badge>
                        </div>
                        <div className="relative w-full sm:w-72 group">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                            <Input
                                placeholder="Search services..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all bg-white"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/30 hover:bg-gray-50/30">
                                    <TableHead className="pl-6 w-[300px]">Service Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredServices.map((service) => (
                                    <TableRow key={service.id} className="group hover:bg-blue-50/10 transition-colors">
                                        <TableCell className="pl-6 font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                                    <service.icon className="h-4 w-4" />
                                                </div>
                                                {service.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal text-gray-600 bg-white">
                                                {service.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono font-medium text-gray-900">
                                            ${service.price.toFixed(2)} <span className="text-gray-400 text-xs font-sans">{service.unit}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={service.isActive}
                                                onCheckedChange={() => handleToggleStatus(service.id)}
                                                className="data-[state=checked]:bg-emerald-500"
                                            />
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(service)}
                                                className="h-8 w-8 p-0 text-gray-400 hover:text-primary hover:bg-primary/5"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Service</DialogTitle>
                        <DialogDescription>
                            Make changes to service details and pricing here.
                        </DialogDescription>
                    </DialogHeader>
                    {editingService && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    value={editingService.name}
                                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">Price</Label>
                                <div className="col-span-3 relative">
                                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="price"
                                        type="number"
                                        value={editingService.price}
                                        onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) })}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="unit" className="text-right">Unit</Label>
                                <Input
                                    id="unit"
                                    value={editingService.unit}
                                    onChange={(e) => setEditingService({ ...editingService, unit: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} className="gradient-primary border-0">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
