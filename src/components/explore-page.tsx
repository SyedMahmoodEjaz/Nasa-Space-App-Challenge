"use client";

import imageData from '@/lib/placeholder-images.json';
import AppHeader from '@/components/app-header';
import ExploreSidebar from '@/components/explore/explore-sidebar';
import ImageViewer from '@/components/explore/image-viewer';
import { useState } from 'react';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  width: number;
  height: number;
};

const PlaceHolderImages: ImagePlaceholder[] = imageData.placeholderImages;

export type LabeledFeature = {
  id: string;
  x: number;
  y: number;
  label: string;
  description: string;
};

export default function ExplorePage() {
    const [selectedImage, setSelectedImage] = useState<ImagePlaceholder>(PlaceHolderImages[0]);
    const [labeledFeatures, setLabeledFeatures] = useState<LabeledFeature[]>([]);
    const [overlayLayers, setOverlayLayers] = useState<Record<string, boolean>>({
        altimeter: false,
        infrared: false,
    });
    const [viewerState, setViewerState] = useState({ scale: 1, x: 0, y: 0 });

    const addFeature = (feature: Omit<LabeledFeature, 'id'>) => {
        setLabeledFeatures(prev => [...prev, { ...feature, id: new Date().toISOString() }]);
    };

    const handleImageSelect = (image: ImagePlaceholder) => {
        setSelectedImage(image);
        setLabeledFeatures([]);
        setViewerState({ scale: 1, x: 0, y: 0 });
    }

    return (
        <div className="flex h-screen w-screen flex-col bg-background text-foreground overflow-hidden">
            <AppHeader />
            <main className="flex flex-1 overflow-hidden">
                <ExploreSidebar 
                    images={PlaceHolderImages}
                    selectedImage={selectedImage}
                    onImageSelect={handleImageSelect}
                    overlayLayers={overlayLayers}
                    onOverlayChange={setOverlayLayers}
                    setViewerState={setViewerState}
                    currentImage={selectedImage}
                />
                <div className="flex-1 relative bg-black/50">
                    <ImageViewer 
                        image={selectedImage}
                        features={labeledFeatures}
                        onAddFeature={addFeature}
                        overlays={overlayLayers}
                        viewerState={viewerState}
                        setViewerState={setViewerState}
                    />
                </div>
            </main>
        </div>
    );
}
