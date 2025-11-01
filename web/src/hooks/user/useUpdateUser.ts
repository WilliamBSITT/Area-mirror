import {useCallback, useState} from "react";

export type UserUpdate = {
    email?: string;
    password?: string;
    pictures?: string;
};

export function usePutUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const putUser = useCallback(async (payload: UserUpdate, imageFile?: File) => {
        setLoading(true);
        setError(null);
        try {
            let finalPayload = { ...payload };

            if (imageFile) {
                const base64 = await convertFileToBase64(imageFile);
                finalPayload.pictures = base64;
            }

            const res = await fetch(`/api/users`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(finalPayload),
            });

            const text = await res.text();

            let json = null;
            if (text && text.trim()) {
                try {
                    json = JSON.parse(text);
                } catch (e) {
                    throw new Error(`Invalid response from server: ${text.substring(0, 100)}`);
                }
            }

            if (!res.ok) {
                throw new Error(json?.error || `Server error: ${res.status}`);
            }

            setData(json);
            return json;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { putUser, loading, error, data };
}
