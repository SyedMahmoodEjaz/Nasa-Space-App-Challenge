"use client";

export async function imageUrlToDataUri(url: string): Promise<string> {
    const proxiedUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url.replace(/^https?:\/\//, ''))}`;

    try {
        const response = await fetch(proxiedUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image via proxy: ${response.statusText}`);
        }
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Image fetch/conversion failed:", error);
        throw error;
    }
}
