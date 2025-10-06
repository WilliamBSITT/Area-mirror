"use client"

import { useCallback } from "react"

export function useAreas(endpoint = "/api/areas") {
    return useCallback(async () => {
        const res = await fetch(endpoint, {
            method: "GET",
            credentials: "include",
            headers: { Accept: "application/json" },
            cache: "no-store",
        })
        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        return res.json() as Promise<Area[]>
    }, [endpoint])
}

export type Area = {
    id: number
    name: string
    status: "success" | "processing" | "failed"
    amount?: number
    enabled?: boolean
}
