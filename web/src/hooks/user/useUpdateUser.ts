import {useCallback, useState} from "react";

export type userUpdate = {
    email: string;
    password: string;
    picture: string;
};

export function usePutUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const putUser = useCallback(async (userid: number | string, payload: userUpdate) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/user/${userid}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            });

            const text = await res.text();
            const json = text ? JSON.parse(text) : null;

            if (!res.ok) {
                throw new Error(json?.error || "Erreur lors de la mise à jour de l'area");
            }

            setData(json);
            return json;
        } catch (err: any) {
            setError(err.message);
            console.error("Erreur PUT /areas :", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { putUser, loading, error, data };
}
