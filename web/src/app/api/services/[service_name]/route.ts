import { NextResponse } from 'next/server';
import type { ServiceDetails } from '@/types/service';

const BASE_URL = process.env.BACKEND_URL ?? 'http://localhost:8000';
export const dynamic = 'force-dynamic';

export async function GET(
    _req: Request,
    { params }: { params: { service_name: string } }
) {
    try {
        const url = `${BASE_URL}/services/${encodeURIComponent(params.service_name)}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
            return NextResponse.json(
                { error: `Upstream error ${res.status}` },
                { status: res.status }
            );
        }
        const data = (await res.json()) as ServiceDetails;
        return NextResponse.json(data, { status: 200 });
    } catch (err: unknown) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
