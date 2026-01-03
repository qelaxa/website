"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type RegionStatus = "available" | "surcharge" | "unavailable";

export function ZipCodeChecker() {
    const [zip, setZip] = useState("");
    const [status, setStatus] = useState<RegionStatus | null>(null);
    const [message, setMessage] = useState("");

    const checkZip = () => {
        // Toledo: 436xx
        if (zip.startsWith("436")) {
            setStatus("available");
            setMessage("Great news! You are in our standard service area.");
            return;
        }
        // Bowling Green: 43402, 43403, Maumee: 43537
        if (["43402", "43403", "43537"].includes(zip)) {
            setStatus("available");
            setMessage("Great news! You are in our standard service area.");
            return;
        }
        // Perrysburg: 43551, Sylvania: 43560 ($5 Surcharge)
        if (["43551", "43560"].includes(zip)) {
            setStatus("surcharge");
            setMessage("We serve your area with a small $5 delivery surcharge.");
            return;
        }

        setStatus("unavailable");
        setMessage("Sorry, we don't serve this area yet. Check back soon!");
    };

    return (
        <Card className="w-full max-w-md mx-auto shadow-lg border-t-4 border-t-primary">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Check Availability
                </CardTitle>
                <CardDescription>
                    Enter your zip code to see if we're in your neighborhood.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Enter Zip Code (e.g. 43606)"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="text-lg"
                        maxLength={5}
                    />
                    <Button onClick={checkZip}>Check</Button>
                </div>

                {status && (
                    <div className={cn(
                        "p-3 rounded-md flex items-start gap-3 text-sm font-medium",
                        status === "available" ? "bg-green-50 text-green-700" :
                            status === "surcharge" ? "bg-yellow-50 text-yellow-700" :
                                "bg-red-50 text-red-700"
                    )}>
                        {status === "available" && <Check className="h-5 w-5 shrink-0" />}
                        {status === "surcharge" && <MapPin className="h-5 w-5 shrink-0" />}
                        {status === "unavailable" && <X className="h-5 w-5 shrink-0" />}
                        <div>
                            <p className="font-bold">
                                {status === "available" ? "available" : status === "surcharge" ? "Available ($5 Surcharge)" : "Unavailable"}
                            </p>
                            <p className="font-normal mt-0.5">{message}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
