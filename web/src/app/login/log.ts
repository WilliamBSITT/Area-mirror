'use client"'
import { useState } from "react";
import { useRouter } from "next/navigation";

export function send_login_forms(email: string, password: string) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleClick = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email || null,
                    password: password || null,
                }),
            });
            if (!res.ok) throw new Error("Erreur serveur");
            const result = await res.json();
            setData(result);
            if (res.status === 200 || res.status === 201) {
                router.push("/");
            } else {
                const result = await res.json();
                setError(result.error || "Erreur lors de l'inscription");
            }
        } catch (err) {
            setError("Impossible de contacter le back");
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, handleClick };
}