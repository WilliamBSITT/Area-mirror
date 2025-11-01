"use client"

import { useCallback } from "react"

export function useCheckJWT() {
    return useCallback(async (): Promise<boolean> => {
        try {
            const res = await fetch("/api/auth/auth", {
                method: "GET",
                credentials: "include",
                headers: { Accept: "application/json" },
                cache: "no-store",
            });
            return res.status === 200;
        } catch {
            return false;
        }
    }, []);
}
