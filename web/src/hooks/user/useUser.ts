"use client"

import { useCallback } from "react"
import { User } from "@/types/user"

export function useUser(endpoint = "/api/users") {
    return useCallback(async () => {
        const res = await fetch(endpoint, {
            method: "GET",
            credentials: "include",
            headers: { Accept: "application/json" },
            cache: "no-store",
        })
        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        return res.json() as Promise<User>
    }, [endpoint])
}
