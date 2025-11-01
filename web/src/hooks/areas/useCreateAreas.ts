import { useState, useCallback } from "react";

export type AreaPayloadCreate = {
    action: string;
    action_service: string;
    frequency: number;
    name: string;
    params: Record<string, string>;
    reaction: string;
    reaction_service: string;
    public: boolean;
};

export function usePostArea() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const postArea = useCallback(async (payload: AreaPayloadCreate) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/areas", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || "Erreur lors de la création de l'area");
            }

            setData(json);
            return json;
        } catch (err: any) {
            setError(err.message);
            console.error("Erreur POST /areas :", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { postArea, loading, error, data };
}
