"use client"

import { useCallback } from "react"

export function useCheckJWT(endpoint: string = "/api/auth/token") {
    return useCallback(async (): Promise<boolean> => {
        try {
            const res = await fetch(endpoint, {
                method: "GET",
                credentials: "include",
                headers: { Accept: "application/json" },
                cache: "no-store",
            });
            return res.status === 200;
        } catch {
            return false;
        }
    }, [endpoint]);
}
