"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function OAuthCodeHandler() {
    const sp = useSearchParams();
    const router = useRouter();
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
                router.replace("/");
            } else {
                router.replace("/login?error=oauth_exchange_failed");
            }
        })();
    }, [code, router]);

    return null;
}
