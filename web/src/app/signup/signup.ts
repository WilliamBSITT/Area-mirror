'use client"'
import { useState } from "react";

export function send_signup_forms(email: string, password: string) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClick = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:8080/register", {
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
        } catch (err) {
            setError("Impossible de contacter le back");
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, handleClick };
}