import { useState, useCallback } from "react";
import { Area } from "@/types/service";

export function useAreaDetails() {
    const [data, setData] = useState<Area | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchArea = useCallback(async (areaId: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/areas/${areaId}`, {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });

            if (!res.ok) {
                throw new Error(`Error ${res.status}`);
            }

            const areaData = await res.json();
            setData(areaData);
            return areaData;
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Unknown error");
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, fetchArea };
}
