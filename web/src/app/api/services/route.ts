import { NextResponse } from 'next/server';
import type { Service } from '@/types/service';

const BACKEND_URL = process.env.BACKEND_URL!
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const res = await fetch(`${BACKEND_URL}/services/`, { cache: 'no-store' });
        if (!res.ok) {
            return NextResponse.json(
                { error: `Upstream error ${res.status}` },
                { status: res.status },
            );
        }
        const data = (await res.json()) as Service[];
        return NextResponse.json(data, { status: 200 });
    } catch (err: unknown) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Unknown error' },
            { status: 500 },
        );
    }
}
