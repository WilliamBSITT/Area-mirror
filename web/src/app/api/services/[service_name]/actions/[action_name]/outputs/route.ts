import { NextResponse } from 'next/server';
import type { ServicesActionsOutputs } from '@/types/service';

const BASE_URL = process.env.BACKEND_URL ?? 'http://localhost:8000';
export const dynamic = 'force-dynamic';

export async function GET(
    _req: Request,
    context: { params: Promise<{ service_name: string; action_name: string }> }
) {
    try {
        const { service_name, action_name } = await context.params;

        const url = `${BASE_URL}/services/${encodeURIComponent(service_name)}/actions/${encodeURIComponent(action_name)}/outputs`;
        const res = await fetch(url, { cache: 'no-store' });

        if (!res.ok) {
            return NextResponse.json(
                { error: `Upstream error ${res.status}` },
                { status: res.status }
            );
        }

        const data = (await res.json()) as ServicesActionsOutputs;
        return NextResponse.json(data, { status: 200 });
    } catch (err: unknown) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
