"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { discoverNewPatterns, DiscoverNewPatternsOutput } from '@/ai/flows/ai-discover-new-patterns';
import type { ImagePlaceholder } from '@/components/explore-page';
import { Loader2 } from 'lucide-react';
import { imageUrlToDataUri } from '@/lib/image-helpers';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type DiscoverTabProps = {
    currentImage: ImagePlaceholder;
}

export default function DiscoverTab({ currentImage }: DiscoverTabProps) {
    const [isDiscovering, setIsDiscovering] = useState(false);
    const [discoveryResult, setDiscoveryResult] = useState<DiscoverNewPatternsOutput | null>(null);
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDiscovery = async () => {
        setIsDiscovering(true);
        setDiscoveryResult(null);
        setIsDialogOpen(true);

        try {
            const imageDataUri = await imageUrlToDataUri(currentImage.imageUrl);
            const result = await discoverNewPatterns({
                imageDataUri: imageDataUri,
                task: `Analyze the image of ${currentImage.description} and identify any interesting geological patterns, anomalies, or features that stand out. Provide a concise report on your findings.`,
            });
            setDiscoveryResult(result);
        } catch (error) {
            console.error('Pattern discovery failed:', error);
            setIsDialogOpen(false);
            toast({
                variant: 'destructive',
                title: 'Pattern Discovery Failed',
                description: 'Could not get a result from the AI. Please try again.',
            });
        } finally {
            setIsDiscovering(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Discover New Patterns</CardTitle>
                <CardDescription>Use AI to analyze the current image for new patterns and anomalies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full" onClick={handleDiscovery} disabled={isDiscovering}>
                             {isDiscovering ? <Loader2 className="animate-spin" /> : 'Discover Patterns'}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>AI Pattern Analysis</DialogTitle>
                            <DialogDescription>
                                {`Analysis for: ${currentImage.description}`}
                            </DialogDescription>
                        </DialogHeader>
                        {isDiscovering ? (
                             <div className="flex justify-center items-center p-8">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground space-y-4 max-h-[60vh] overflow-y-auto p-1">
                                <p>{discoveryResult?.analysisResult || "No results found."}</p>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
