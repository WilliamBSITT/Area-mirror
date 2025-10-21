import { useCallback, useEffect, useRef, useState } from 'react';
import type { ServicesReactionsParams } from '@/types/service';

type UseServiceReactionParams = {
    data: ServicesReactionsParams | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
};

export function useServiceReactionParams(
    serviceName?: string | null,
    reactionName?: string | null
): UseServiceReactionParams {
    const [data, setData] = useState<ServicesReactionsParams | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const controllerRef = useRef<AbortController | null>(null);

    const fetchParams = useCallback(async () => {
        if (!serviceName || !reactionName) {
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
            console.log("here");
            console.log(serviceName, reactionName);
            console.log("here");
            const res = await fetch(
                `/api/services/${encodeURIComponent(serviceName)}/reactions/${encodeURIComponent(reactionName)}/params`,
                { signal: controller.signal }
            );

            if (!res.ok) throw new Error(`Request failed with ${res.status}`);

            const json = (await res.json()) as ServicesReactionsParams;
            setData(json);
        } catch (e: any) {
            if (e?.name !== 'AbortError') setError(e as Error);
        } finally {
            setLoading(false);
        }
    }, [serviceName, reactionName]);

    useEffect(() => {
        fetchParams();
        return () => controllerRef.current?.abort();
    }, [fetchParams]);

    return { data, loading, error, refetch: fetchParams };
}
