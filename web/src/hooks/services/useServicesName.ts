import { useCallback, useEffect, useRef, useState } from 'react';
import type { ServiceDetails } from '@/types/service';

type UseServiceDetails = {
    data: ServiceDetails | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
};

export function useServiceDetails(serviceName?: string | null): UseServiceDetails {
    const [data, setData] = useState<ServiceDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const controllerRef = useRef<AbortController | null>(null);

    const fetchDetails = useCallback(async () => {
        if (!serviceName) {
            setData(null);
            setError(null);
            setLoading(false);
            return;
        }

        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/services/${encodeURIComponent(serviceName)}`, {
                signal: controller.signal,
            });
            if (!res.ok) throw new Error(`Request failed with ${res.status}`);
            const json = (await res.json()) as ServiceDetails;
            setData(json);
        } catch (e: any) {
            if (e?.name !== 'AbortError') setError(e as Error);
        } finally {
            setLoading(false);
        }
    }, [serviceName]);

    useEffect(() => {
        fetchDetails();
        return () => controllerRef.current?.abort();
    }, [fetchDetails]);

    return { data, loading, error, refetch: fetchDetails };
}
