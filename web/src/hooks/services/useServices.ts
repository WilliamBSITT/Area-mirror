"use client"

import { useCallback, useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL

export type Services = {
    id: number;
    name: string;
    description: string;
    image: string;
}

export function useServices() {
    const [data, setData] = useState<Services[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchServices = useCallback(async (signal?: AbortSignal) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/services`, {
                method: "GET",
                headers: { Accept: "application/json" },
                cache: "no-store",
                signal,
            });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status} – ${res.statusText}`);
            }
            const json = (await res.json()) as Services[];
            setData(json);
        } catch (e: any) {
            if (e?.name !== "AbortError") setError(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchServices(controller.signal);
        return () => controller.abort();
    }, [fetchServices]);

    const refetch = useCallback(() => fetchServices(), [fetchServices]);

    return { data, isLoading, error, refetch };
}





