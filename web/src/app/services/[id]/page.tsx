"use client";

import { useParams } from "next/navigation";
import Image, { type StaticImageData } from "next/image";
import { useServices } from "@/hooks/services/useServices";
import { useServiceDetails } from "@/hooks/services/useServicesName";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import fallbackImg from "@/../public/landing.jpg";

function toImageSrc(image?: string | null): string | StaticImageData {
    if (!image) return fallbackImg;

    const raw = image.trim();
    if (!raw) return fallbackImg;

    if (raw.startsWith("data:")) {
        const cleaned = raw.replace(/\s+$/g, "");
        return cleaned.includes(",") ? cleaned : fallbackImg;
    }

    if (/^https?:\/\//i.test(raw)) return raw;

    const b64 = raw.replace(/\s/g, "");
    return `data:image/png;base64,${b64}`;
}

export default function ServiceDetailPage() {
    const params = useParams();
    const id = parseInt(params.id as string, 10);

    const { data: services, loading, error } = useServices();
    const service = services?.find(s => s.id === id);

    const { data: serviceDetails, loading: detailsLoading } = useServiceDetails(service?.name);

    if (loading || detailsLoading) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-lg">Loading...</p>
                </div>
            </main>
        );
    }

    if (error || !service) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                    <Button asChild variant="outline">
                        <Link href="/services">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to services
                        </Link>
                    </Button>
                </div>
            </main>
        );
    }

    const imageSrc = toImageSrc(service.image);

    return (
        <main className="container mx-auto px-4 py-8">
            <Button asChild variant="ghost" className="mb-6">
                <Link href="/services">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour aux services
                </Link>
            </Button>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="relative aspect-video rounded-lg overflow-hidden border-2 shadow-lg">
                    <Image
                        src={imageSrc}
                        alt={service.name}
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{service.name}</h1>
                        <p className="text-muted-foreground">Service #{service.id}</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3">Description</h2>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            {service.description || "No description available for this service."}
                        </p>
                    </div>

                    {serviceDetails?.auth_url && (
                        <Button
                            asChild
                            size="lg"
                            className="w-full md:w-auto"
                        >
                            <a
                                href={
                                    service.name.toLowerCase() === "Spotify" || service.name.toLowerCase() === "Github"
                                        ? `${serviceDetails.auth_url}?frontend=web`
                                        : serviceDetails.auth_url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Authentication
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    )}
                </div>
            </div>
        </main>
    );
}
