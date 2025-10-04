import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type LayersTabProps = {
    overlayLayers: Record<string, boolean>;
    onOverlayChange: (layers: Record<string, boolean>) => void;
}

const availableLayers = [
    { id: 'altimeter', name: 'Laser Altimeter Data' },
    { id: 'infrared', name: 'Infrared Overlay' },
];

export default function LayersTab({ overlayLayers, onOverlayChange }: LayersTabProps) {
    const handleToggle = (layerId: string, checked: boolean) => {
        onOverlayChange({
            ...overlayLayers,
            [layerId]: checked,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Data Overlays</CardTitle>
                <CardDescription>Overlay related image sets to explore them simultaneously.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {availableLayers.map((layer) => (
                    <div key={layer.id} className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-background">
                        <Label htmlFor={layer.id} className="pr-4">{layer.name}</Label>
                        <Switch
                            id={layer.id}
                            checked={!!overlayLayers[layer.id]}
                            onCheckedChange={(checked) => handleToggle(layer.id, checked)}
                        />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
