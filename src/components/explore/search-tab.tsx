"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { aiSearchForFeatures, AISearchForFeaturesOutput } from '@/ai/flows/ai-search-for-features';
import type { ImagePlaceholder } from '@/components/explore-page';
import { Loader2 } from 'lucide-react';
import { imageUrlToDataUri } from '@/lib/image-helpers';

type SearchTabProps = {
    setViewerState: (state: { scale: number; x: number; y: number }) => void;
    currentImage: ImagePlaceholder;
}

export default function SearchTab({ setViewerState, currentImage }: SearchTabProps) {
    const [isSearching, setIsSearching] = useState(false);
    const [aiResult, setAiResult] = useState<AISearchForFeaturesOutput | null>(null);
    const { toast } = useToast();

    const handleAiSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const description = formData.get('description') as string;

        if (!description) {
            toast({
                variant: 'destructive',
                title: "Search description can't be empty",
                description: 'Please describe the feature you want to find.',
            });
            return;
        }

        setIsSearching(true);
        setAiResult(null);

        try {
            const imageDataUri = await imageUrlToDataUri(currentImage.imageUrl);
            const result = await aiSearchForFeatures({
                imageDescription: description,
                imageDataUri: imageDataUri
            });
            setAiResult(result);
            toast({
                title: "AI Search Complete",
                description: "The AI has analyzed the image.",
            });
        } catch (error) {
            console.error('AI search failed:', error);
            toast({
                variant: 'destructive',
                title: 'AI Search Failed',
                description: 'Could not get a result from the AI. Please try again.',
            });
        } finally {
            setIsSearching(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Search by Coordinates</CardTitle>
                    <CardDescription>Pan to a specific location. (Demo)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="coord-x">X Coordinate</Label>
                        <Input id="coord-x" placeholder="e.g., 1024" type="number"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="coord-y">Y Coordinate</Label>
                        <Input id="coord-y" placeholder="e.g., 2048" type="number" />
                    </div>
                    <Button className="w-full" variant="secondary" onClick={() => setViewerState({ scale: 3, x: -1024, y: -2048 })}>Go to Coordinates</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>AI-Powered Search</CardTitle>
                    <CardDescription>Describe a feature and let AI find it for you.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAiSearch} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="description">Feature Description</Label>
                            <Textarea id="description" name="description" placeholder="e.g., 'a large crater in the upper left quadrant'" />
                        </div>
                        <Button type="submit" className="w-full" disabled={isSearching}>
                            {isSearching ? <Loader2 className="animate-spin" /> : 'Search with AI'}
                        </Button>
                    </form>
                    {aiResult && (
                        <div className="mt-4 space-y-2 rounded-lg border bg-secondary/50 p-4 text-sm">
                            <p><strong>Coordinates:</strong> {aiResult.relevantCoordinates || 'Not found'}</p>
                            <p><strong>Reasoning:</strong> {aiResult.reasoning}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
