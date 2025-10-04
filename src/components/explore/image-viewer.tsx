"use client";

import { useRef, useState, WheelEvent, MouseEvent } from 'react';
import type { ImagePlaceholder, LabeledFeature } from '@/components/explore-page';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Plus, Minus, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type ImageViewerProps = {
    image: ImagePlaceholder;
    features: LabeledFeature[];
    onAddFeature: (feature: Omit<LabeledFeature, 'id'>) => void;
    overlays: Record<string, boolean>;
    viewerState: { scale: number; x: number; y: number };
    setViewerState: (state: { scale: number; x: number; y: number }) => void;
};

type NewFeaturePopoverState = {
    x: number;
    y: number;
} | null;

export default function ImageViewer({ image, features, onAddFeature, overlays, viewerState, setViewerState }: ImageViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPanning, setIsPanning] = useState(false);
    const [startPan, setStartPan] = useState({ x: 0, y: 0 });
    const [newFeaturePopover, setNewFeaturePopover] = useState<NewFeaturePopoverState>(null);

    const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
        e.preventDefault();
        const { deltaY } = e;
        const scaleAmount = -deltaY * 0.001;
        const newScale = Math.max(0.5, Math.min(10, viewerState.scale + scaleAmount * viewerState.scale));
        
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newX = mouseX - (mouseX - viewerState.x) * (newScale / viewerState.scale);
        const newY = mouseY - (mouseY - viewerState.y) * (newScale / viewerState.scale);

        setViewerState({ scale: newScale, x: newX, y: newY });
    };

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if(e.button !== 0 || e.ctrlKey || e.metaKey) return; 
        e.preventDefault();
        setIsPanning(true);
        setStartPan({ x: e.clientX - viewerState.x, y: e.clientY - viewerState.y });
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isPanning) return;
        e.preventDefault();
        setViewerState({ ...viewerState, x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    };

    const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
        if (isPanning) {
            e.preventDefault();
            setIsPanning(false);
        }
    };

    const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
        if (isPanning) return;
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const imageX = (e.clientX - rect.left - viewerState.x) / viewerState.scale;
        const imageY = (e.clientY - rect.top - viewerState.y) / viewerState.scale;
        setNewFeaturePopover({ x: imageX, y: imageY });
    };
    
    const resetView = () => setViewerState({ scale: 1, x: 0, y: 0 });
    const zoomIn = () => setViewerState(s => ({...s, scale: Math.min(10, s.scale * 1.5)}));
    const zoomOut = () => setViewerState(s => ({...s, scale: Math.max(0.5, s.scale / 1.5)}));

    const handleSaveFeature = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newFeaturePopover) return;
        const formData = new FormData(e.currentTarget);
        const label = formData.get('label') as string;
        const description = formData.get('description') as string;
        onAddFeature({ x: newFeaturePopover.x, y: newFeaturePopover.y, label, description });
        setNewFeaturePopover(null);
    };

    const imageSize = {
        width: image.width,
        height: image.height,
    }

    return (
        <div 
            ref={containerRef}
            className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing bg-black/80"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDoubleClick}
        >
            <div
                style={{
                    width: imageSize.width,
                    height: imageSize.height,
                    transform: `translate(${viewerState.x}px, ${viewerState.y}px) scale(${viewerState.scale})`,
                    transformOrigin: 'top left',
                }}
            >
                <Image
                    src={image.imageUrl}
                    alt={image.description}
                    width={imageSize.width}
                    height={imageSize.height}
                    priority
                    className="max-w-none pointer-events-none"
                    data-ai-hint={image.imageHint}
                />
                
                {overlays.altimeter && <div className="absolute inset-0 bg-blue-500/30 backdrop-hue-rotate-180 pointer-events-none" />}
                {overlays.infrared && <div className="absolute inset-0 bg-red-500/30 backdrop-hue-rotate-90 pointer-events-none" />}
                
                {features.map(feature => (
                    <Popover key={feature.id}>
                        <PopoverTrigger asChild>
                            <div 
                                className="absolute -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${feature.x}px`, top: `${feature.y}px` }}
                            >
                                <div className="w-4 h-4 bg-accent rounded-full border-2 border-accent-foreground animate-pulse cursor-pointer shadow-lg"/>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-64" onClick={(e) => e.stopPropagation()}>
                            <h4 className="font-bold">{feature.label}</h4>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </PopoverContent>
                    </Popover>
                ))}

                {newFeaturePopover && (
                     <div
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${newFeaturePopover.x}px`, top: `${newFeaturePopover.y}px` }}
                     >
                        <Popover open onOpenChange={(open) => !open && setNewFeaturePopover(null)}>
                            <PopoverTrigger asChild>
                                <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white cursor-pointer shadow-lg"/>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" onClick={(e) => e.stopPropagation()}>
                                <form onSubmit={handleSaveFeature} className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Label New Feature</h4>
                                        <p className="text-sm text-muted-foreground">Add a label and description for this point.</p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="label">Label</Label>
                                        <Input id="label" name="label" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea id="description" name="description" />
                                    </div>
                                    <Button type="submit">Save Feature</Button>
                                </form>
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
            </div>

            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <Button variant="secondary" size="icon" onClick={zoomIn}><Plus/></Button>
                <Button variant="secondary" size="icon" onClick={zoomOut}><Minus/></Button>
                <Button variant="secondary" size="icon" onClick={resetView}><Home/></Button>
            </div>
        </div>
    );
}
