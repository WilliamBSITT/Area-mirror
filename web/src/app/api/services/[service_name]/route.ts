import { NextResponse } from 'next/server';
import type { ServiceDetails } from '@/types/service';

const BACKEND_URL = process.env.BACKEND_URL!
export const dynamic = 'force-dynamic'

export async function GET(
    _req: Request,
    context: { params: Promise<{ service_name: string }> }
) {
    try {
        const { service_name } = await context.params;
        const url = `${BACKEND_URL}/services/${encodeURIComponent(service_name)}`;
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
