"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";

export default function OAuthCodeHandler() {
    const sp = useSearchParams();
    const router = useRouter();
    const { refresh } = useSession();
    const code = sp.get("code");

    useEffect(() => {
        if (!code) return;
        (async () => {
            const res = await fetch("/api/auth/github", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ code }),
            });
            if (res.ok) {
                const data = await res.json();
                console.log("Réponse JSON:", data);
                router.replace("/");
                await refresh();
            } else {
                const data = await res.json();
                console.log("Réponse JSON:", data);
                router.replace("/login?error=oauth_exchange_failed");
            }
        })();
        console.log(code);
    }, [code, router]);

    return null;
}
