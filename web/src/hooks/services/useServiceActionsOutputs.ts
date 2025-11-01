import { useCallback, useEffect, useRef, useState } from 'react';
import type { ServicesActionsOutputs } from '@/types/service';

type UseServiceActionParams = {
    data: ServicesActionsOutputs | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
};

export function useServiceActionParams(
    serviceName?: string | null,
    actionName?: string | null
): UseServiceActionParams {
    const [data, setData] = useState<ServicesActionsOutputs | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const controllerRef = useRef<AbortController | null>(null);

    const fetchParams = useCallback(async () => {
        if (!serviceName || !actionName) {
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
            const res = await fetch(
                `/api/services/${encodeURIComponent(serviceName)}/actions/${encodeURIComponent(actionName)}/outputs`,
                { signal: controller.signal }
            );
            if (!res.ok) throw new Error(`Request failed with ${res.status}`);
            const json = (await res.json()) as ServicesActionsOutputs;
            setData(json);
        } catch (e: any) {
            if (e?.name !== 'AbortError') setError(e as Error);
        } finally {
            setLoading(false);
        }
    }, [serviceName, actionName]);

    useEffect(() => {
        fetchParams();
        return () => controllerRef.current?.abort();
    }, [fetchParams]);

    return { data, loading, error, refetch: fetchParams };
}
