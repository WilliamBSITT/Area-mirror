import { NextResponse } from 'next/server';
import type { ServicesReactionsParams } from '@/types/service';

const BASE_URL = process.env.BACKEND_URL ?? 'http://localhost:8000';
export const dynamic = 'force-dynamic';

export async function GET(
    _req: Request,
    context: { params: Promise<{ service_name: string; reaction_name: string }> }
) {
    try {
        const { service_name, reaction_name } = await context.params;

        const url = `${BASE_URL}/services/${encodeURIComponent(service_name)}/reactions/${encodeURIComponent(reaction_name)}/params`;

        const res = await fetch(url, { cache: 'no-store' });

        if (!res.ok) {
            return NextResponse.json(
                { error: `Upstream error ${res.status}` },
                { status: res.status }
            );
        }

        console.log("here");
        console.log(service_name, reaction_name);
        console.log("here");
        const data = (await res.json()) as ServicesReactionsParams;
        return NextResponse.json(data, { status: 200 });
    } catch (err: unknown) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
