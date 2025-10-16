"use client";

import { useServices, type Services } from "@/hooks/services/useServices";
import { CardServices } from "@/components/cardServices";

export default function Page() {
    const { data, isLoading, error, refetch } = useServices();

    if (isLoading) {
        return (
            <main className="py-8 bg-sky-100">
                <div className="container mx-auto px-4">Chargement…</div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="py-8 bg-sky-100">
                <div className="container mx-auto px-4">
                    <p className="text-red-600">Erreur: {error.message}</p>
                    <button onClick={refetch} className="underline">Réessayer</button>
                </div>
            </main>
        );
    }

    if (!data?.length) {
        return (
            <main className="py-8 bg-sky-100">
                <div className="container mx-auto px-4">Aucun service.</div>
            </main>
        );
    }

    const maxId = Math.max(...data.map((s) => s.id));
    const ids = Array.from({ length: maxId }, (_, i) => i + 1);

    const byId = new Map<number, Services>(data.map((s) => [s.id, s]));

    return (
        <main className="py-8 bg-sky-100">
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
