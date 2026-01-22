import { useState, useCallback } from "react";

export type AreaPayloadUpdate = {
    action: string;
    action_service: string;
    frequency: number;
    name: string;
    params: Record<string, string>;
    reaction: string;
    reaction_service: string;
    public: boolean;
};

export function usePutArea() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const putArea = useCallback(async (areaId: number | string, payload: AreaPayloadUpdate) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/areas/${areaId}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            });

            const text = await res.text();
            const json = text ? JSON.parse(text) : null;

            if (!res.ok) {
                throw new Error(json?.error || "Error updating area");
            }

            setData(json);
            return json;
        } catch (err: any) {
            setError(err.message);
            console.error("Error PUT /areas:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { putArea, loading, error, data };
}
