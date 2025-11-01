"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const logos = [
    "/logo/discord.png",
    "/logo/github.png",
    "/logo/gmail.png",
    "/logo/movie_db.png",
    "/logo/nasa.png",
    "/logo/open_weather.png",
    "/logo/spotify.png",
    "/logo/strava.png",
]

export function CarouselServices() {
    return (
        <Carousel
            plugins={[Autoplay({ delay: 5000 })]}
            opts={{ align: "start" }}
            className="w-full"
        >
            <CarouselContent>
                {logos.map((src, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/5">
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-4">
                                    <Image
                                        src={src}
                                        alt={`Logo ${index + 1}`}
                                        width={100}
                                        height={100}
                                        className="object-contain"
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
