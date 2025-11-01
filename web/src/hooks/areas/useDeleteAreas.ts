"use client";

import { useCallback, useMemo, useState } from "react";

type DeleteResult =
    | { ok: true; status: number; body: any }
    | { ok: false; status: number; error: string; body?: any };

type UseAreaDeleteOptions = {
    onMutate?: (areaId: number) => void;
    onRevalidate?: () => void | Promise<void>;
};

export function useAreaDelete(options: UseAreaDeleteOptions = {}) {
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const remove = useCallback(
        async (areaId: number): Promise<DeleteResult> => {
            setError(null);
            setLoadingId(areaId);
            options.onMutate?.(areaId);

            try {
                const res = await fetch(`/api/areas/${areaId}`, {
                    method: "DELETE",
                    credentials: "include",
                    headers: { Accept: "application/json" },
                    cache: "no-store",
                });

                const txt = await res.text();
                let body: any = null;
                try {
                    body = txt ? JSON.parse(txt) : null;
                } catch {
                    body = txt;
                }

                if (!res.ok) {
                    const message =
                        typeof body === "object" && body?.error
                            ? String(body.error)
                            : `Failed to delete area ${areaId} (${res.status})`;
                    setError(message);
                    return {
                        ok: false,
                        status: res.status,
                        error: String(body?.error ?? "delete_failed"),
                        body,
                    };
                }

                await options.onRevalidate?.();
                return { ok: true, status: res.status, body };
            } catch (e: any) {
                setError(e?.message ?? "network_error");
                return { ok: false, status: 0, error: e?.message ?? "network_error" };
            } finally {
                setLoadingId((prev) => (prev === areaId ? null : prev));
            }
        },
        [options]
    );

    return useMemo(
        () => ({ remove, loadingId, error, setError }),
        [remove, loadingId, error]
    );
}
