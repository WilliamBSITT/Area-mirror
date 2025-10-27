"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { Service } from "@/types/service";
import Image, { type StaticImageData } from "next/image";
import fallbackImg from "../../public/landing.jpg";

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

type Props = {
    id: number;
    service?: Service | null;
};

export function CardServices({ id, service }: Props) {
    const src = toImageSrc(service?.image);

    return (
        <Card className="w-full max-w-sm flex flex-col h-full">  {/* Ajout de flex flex-col h-full */}
            <CardHeader className="pb-2">
                <CardTitle className="font-bold text-left">
                    {service?.name ?? `Service #${id}`}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex items-center justify-center flex-grow">  {/* Ajout de flex-grow */}
                <Image
                    src={src}
                    alt="landingpageImage"
                    width={400}
                    height={300}
                    priority
                />
            </CardContent>

            <CardFooter className="justify-end mt-auto">  {/* Ajout de mt-auto */}
                <Button asChild className="ml-auto">
                    <Link href={`/services/${service?.id ?? id}`}>See more</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
