"use client"

import StarBorder from '@/components/StarBorder'
import CircularGallery from '@/components/CircularGallery'
import { useRouter } from 'next/navigation'

export default function Page() {
    const router = useRouter()

    return (
        <main className="py-8 justify-center ">
            <div style={{ height: '600px', position: 'relative' }}>
                <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} scrollEase={0.07}/>
            </div>

            <div className="flex justify-center items-center py-20">
                <StarBorder
                    as="button"
                    className="custom-class"
                    color="cyan"
                    speed="5s"
                    onClick={() => window.location.href = '/client.apk'}
                >
                    Download the app
                </StarBorder>
            </div>
        </main>
    );
}
