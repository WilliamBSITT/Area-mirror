"use client"

import Image from "next/image";
import NextImage from "@/../public/landing.jpg"
import Link from 'next/link'
import { CarouselServices } from "@/components/carouselServices"
import AuthCodeReader from "@/hooks/auth/useSearchParams";

export default function Home() {
  return (
    <main className="py-8">
        <AuthCodeReader />
        <section className="grid md:grid-cols-2">
            <div>
                <div className="px-20">
                    <h1 className="text-4xl">
                        Connect your apps and
                        <br />
                        <span className="font-bold text-blue-900">
                    automate workflows
                </span>
                    </h1>
                    <br />
                    <p className="max-w-lg">
                        Our app makes automation easy and effortless. In just a few clicks,
                        connect your APIs and build smart workflows that run on their own.
                        No more repetitive tasks—save time, stay focused on what matters,
                        and let our platform do the work for you.
                        The perfect tool for busy people who want to achieve more with less effort.
                    </p>
                </div>
                <br />
                <div className="px-14">
                    <h1 className="text-4xl">
                        Ready To Explore?
                        <br />
                        <div className="max-w-xl font-bold text-blue-900">
                            <Link href="/login">Start using TriggerHub for free today</Link>
                        </div>
                    </h1>
                </div>
                <br />
                <div className="px-14">
                    <h1 className="text-4xl">
                        They trust us
                    </h1>
                </div>
                <br />
            </div>

            <div className="py-5">
                <Image
                    src={NextImage}
                    alt="landingpageImage"
                    width={400}
                    priority
                />
            </div>
            <div className="px-14 w-screen">
                <CarouselServices/>
            </div>
        </section>
    </main>
  );
}
