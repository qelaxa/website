"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Search, Plus, Edit2, DollarSign, Shirt, Sparkles, Bed, Scissors, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";

// Icon mapping
const iconMap: Record<string, any> = {
    "Shirt": Shirt,
    "Sparkles": Sparkles,
    "Bed": Bed,
    "Scissors": Scissors,
    "Tag": Tag
};

export default function ServiceManagementPage() {
    const supabase = createClient();
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingService, setEditingService] = useState<any>(null); // null means new service

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('name');

            if (error) throw error;
            setServices(data || []);
        } catch (error) {
            console.error("Error fetching services:", error);
            toast.error("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        setEditingService({
            name: "",
            category: "Standard",
            price: 0,
            unit: "item",
            is_active: true,
            icon: "Shirt"
        });
        setIsEditOpen(true);
    };

    const handleEdit = (service: any) => {
        setEditingService({ ...service });
        setIsEditOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingService.id) {
                // Update
                const { error } = await supabase
                    .from('services')
                    .update({
                        name: editingService.name,
                        price: editingService.price,
                        unit: editingService.unit,
                        category: editingService.category,
                        icon: editingService.icon
                    })
                    .eq('id', editingService.id);
                if (error) throw error;
                toast.success("Service updated");
            } else {
                // Insert
                const { error } = await supabase
                    .from('services')
                    .insert([{
                        name: editingService.name,
                        price: editingService.price,
                        unit: editingService.unit,
                        category: editingService.category,
                        icon: editingService.icon,
                        is_active: true
                    }]);
                if (error) throw error;
                toast.success("Service created");
            }
            fetchServices();
            setIsEditOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save service");
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            // Optimistic update
            setServices(services.map(s => s.id === id ? { ...s, is_active: !currentStatus } : s));

            const { error } = await supabase
                .from('services')
                .update({ is_active: !currentStatus })
                .eq('id', id);

            if (error) {
                // Revert if failed
                setServices(services.map(s => s.id === id ? { ...s, is_active: currentStatus } : s));
                throw error;
            }
            toast.success(currentStatus ? "Service deactivated" : "Service activated");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.category && s.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const IconComponent = (iconName: string) => {
        const Icon = iconMap[iconName] || Tag;
        return <Icon className="h-4 w-4" />;
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Services & Pricing</h1>
                    <p className="text-gray-500 mt-1">Manage your service offerings and pricing structure.</p>
                </div>
                <Button onClick={handleAddNew} className="btn-premium gradient-primary shadow-lg hover:shadow-xl">
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
                                {services.filter(s => s.is_active).length} Active
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
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">Loading services...</TableCell>
                                    </TableRow>
                                ) : filteredServices.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">No services found.</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredServices.map((service) => (
                                        <TableRow key={service.id} className="group hover:bg-blue-50/10 transition-colors">
                                            <TableCell className="pl-6 font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                                        {IconComponent(service.icon)}
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
                                                    checked={service.is_active}
                                                    onCheckedChange={() => handleToggleStatus(service.id, service.is_active)}
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
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit/Add Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingService?.id ? 'Edit Service' : 'Add New Service'}</DialogTitle>
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
                                    placeholder="e.g. /lb, item, flat"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">Category</Label>
                                <Input
                                    id="category"
                                    value={editingService.category}
                                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                                    className="col-span-3"
                                    placeholder="e.g. Wash & Fold, Dry Cleaning"
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
