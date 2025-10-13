"use client";
import { useCallback, useMemo, useState } from "react";

type ToggleResult =
    | { ok: true; status: number; body: any }
    | { ok: false; status: number; error: string; body?: any };

type UseAreasToggleOptions = {
    // Permet de mettre à jour une liste locale (ex: setAreas) de manière optimiste
    onMutate?: (areaId: number, enabled: boolean) => void;
    // Permet de déclencher une revalidation (ex: router.refresh() ou re-fetch client)
    onRevalidate?: () => void | Promise<void>;
};

export function useAreasActivateDeactivate(options: UseAreasToggleOptions = {}) {
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const putEnabled = useCallback(
        async (areaId: number, enabled: boolean): Promise<ToggleResult> => {
            setError(null);
            setLoadingId(areaId);
            // Optimistic update si fourni
            options.onMutate?.(areaId, enabled);

            try {
                const res = await fetch(`/api/areas/${areaId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                credentials: "include",
                body: JSON.stringify({ enabled }),
                cache: "no-store",
                });

                // Tenter de parser JSON, sinon texte brut
                let body: any = null;
                const text = await res.text();
                try {
                    body = text ? JSON.parse(text) : null;
                } catch {
                    body = text;
                }

                if (!res.ok) {
                    // Rollback optimiste si voulu (on laisse au parent le choix de le faire)
                    setError(
                        typeof body === "object" && body?.error
                            ? String(body.error)
                            : `Failed to update area ${areaId} (${res.status})`
                    );
                    return { ok: false, status: res.status, error: String(body?.error ?? "update_failed"), body };
                }

                // Revalidation en aval si fournie (rafraîchir liste, router.refresh, etc.)
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

    const activate = useCallback(
        async (areaId: number) => putEnabled(areaId, true),
        [putEnabled]
    );

    const deactivate = useCallback(
        async (areaId: number) => putEnabled(areaId, false),
        [putEnabled]
    );

    return useMemo(
        () => ({
            activate,
            deactivate,
            loadingId, // id en cours d’update (utile pour désactiver un bouton ligne par ligne)
            error,
            setError,
        }),
        [activate, deactivate, loadingId, error]
    );
}
