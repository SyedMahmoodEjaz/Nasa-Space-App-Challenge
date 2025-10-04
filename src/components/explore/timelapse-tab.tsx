import type { ImagePlaceholder } from "@/components/explore-page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import Image from 'next/image';
import { cn } from "@/lib/utils";

type TimelapseTabProps = {
    images: ImagePlaceholder[];
    selectedImage: ImagePlaceholder;
    onImageSelect: (image: ImagePlaceholder) => void;
}

export default function TimelapseTab({ images, selectedImage, onImageSelect }: TimelapseTabProps) {
    const selectedIndex = images.findIndex(img => img.id === selectedImage.id);

    const handleSliderChange = (value: number[]) => {
        onImageSelect(images[value[0]]);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Dataset Selection</CardTitle>
                <CardDescription>Scrub through different images or select one to explore.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Slider
                        value={[selectedIndex > -1 ? selectedIndex : 0]}
                        max={images.length - 1}
                        step={1}
                        onValueChange={handleSliderChange}
                    />
                    <div className="text-xs text-center text-muted-foreground pt-2">
                        {selectedImage.description}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto p-1">
                    {images.map(image => (
                        <button key={image.id} onClick={() => onImageSelect(image)} className={cn(
                            "relative aspect-video rounded-md overflow-hidden ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 group",
                            selectedImage.id === image.id && "ring-2 ring-accent ring-offset-2 ring-offset-background"
                            )}>
                             <Image
                                src={image.imageUrl}
                                alt={image.description}
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                                className="object-cover transition-transform group-hover:scale-105"
                                data-ai-hint={image.imageHint}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <p className="absolute bottom-1 left-2 text-xs text-white font-medium">{image.description}</p>
                        </button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
