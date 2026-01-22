'use client';

import { useOAuthTokens } from '@/hooks/services/useQAuthTokens';
import { useServices } from '@/hooks/services/useServices';
import type { Service } from '@/types/service';
import { CardServices } from '@/components/cardServices';

export default function Page() {
    useOAuthTokens();

    const { data, loading, error, refetch } = useServices();

    if (loading) {
        return (
            <main className="py-8">
                <div className="container mx-auto px-4">Loading…</div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="py-8">
                <div className="container mx-auto px-4">
                    <p className="text-red-600">Error: {error.message}</p>
                    <button onClick={refetch} className="underline">
                        Retry
                    </button>
                </div>
            </main>
        );
    }

    if (!data?.length) {
        return (
            <main className="py-8">
                <div className="container mx-auto px-4">No services.</div>
            </main>
        );
    }

    const maxId = Math.max(...data.map((s) => s.id));
    const ids = Array.from({ length: maxId }, (_, i) => i + 1);

    const byId = new Map<number, Service>(data.map((s) => [s.id, s]));

    return (
        <main className="py-8">
            <div className="container mx-auto px-4">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {ids.map((id) => (
                        <CardServices key={id} id={id} service={byId.get(id)} />
                    ))}
                </div>
            </div>
        </main>
    );
}
