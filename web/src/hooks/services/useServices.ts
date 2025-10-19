// src/hooks/useServices.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Service } from '@/types/service';

type UseServicesState = {
    data: Service[] | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
};

export function useServices(): UseServicesState {
    const [data, setData] = useState<Service[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const controllerRef = useRef<AbortController | null>(null);

    const fetchServices = useCallback(async () => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/services', { signal: controller.signal });
            if (!res.ok) {
                throw new Error(`Request failed with ${res.status}`);
            }
            const json = (await res.json()) as Service[];
            setData(json);
        } catch (e: unknown) {
            if ((e as any)?.name !== 'AbortError') {
                setError(e as Error);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchServices();
        return () => {
            controllerRef.current?.abort();
        };
    }, [fetchServices]);

    return { data, loading, error, refetch: fetchServices };
}
