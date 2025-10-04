import type { ImagePlaceholder } from "@/components/explore-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchTab from "./search-tab";
import LayersTab from "./layers-tab";
import DiscoverTab from "./discover-tab";
import TimelapseTab from "./timelapse-tab";

type ExploreSidebarProps = {
    images: ImagePlaceholder[];
    selectedImage: ImagePlaceholder;
    onImageSelect: (image: ImagePlaceholder) => void;
    overlayLayers: Record<string, boolean>;
    onOverlayChange: (layers: Record<string, boolean>) => void;
    setViewerState: (state: { scale: number; x: number; y: number }) => void;
    currentImage: ImagePlaceholder;
};

export default function ExploreSidebar({ images, selectedImage, onImageSelect, overlayLayers, onOverlayChange, setViewerState, currentImage }: ExploreSidebarProps) {
    return (
        <aside className="w-96 flex-shrink-0 border-r border-border flex flex-col">
            <ScrollArea className="flex-1">
                <Tabs defaultValue="timelapse" className="p-4">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="timelapse">Data</TabsTrigger>
                        <TabsTrigger value="search">Search</TabsTrigger>
                        <TabsTrigger value="layers">Layers</TabsTrigger>
                        <TabsTrigger value="discover">Discover</TabsTrigger>
                    </TabsList>
                    <TabsContent value="timelapse" className="mt-4">
                        <TimelapseTab images={images} onImageSelect={onImageSelect} selectedImage={selectedImage} />
                    </TabsContent>
                    <TabsContent value="search" className="mt-4">
                        <SearchTab setViewerState={setViewerState} currentImage={currentImage} />
                    </TabsContent>
                    <TabsContent value="layers" className="mt-4">
                        <LayersTab overlayLayers={overlayLayers} onOverlayChange={onOverlayChange} />
                    </TabsContent>
                    <TabsContent value="discover" className="mt-4">
                        <DiscoverTab currentImage={currentImage} />
                    </TabsContent>
                </Tabs>
            </ScrollArea>
        </aside>
    );
}
