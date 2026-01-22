"use client"

import { useCallback } from "react"
import { Area } from "@/types/service"

export function useAreas(endpoint = "/api/areas") {
    return useCallback(async () => {
        const res = await fetch(endpoint, {
            method: "GET",
            credentials: "include",
            headers: { Accept: "application/json" },
            cache: "no-store",
        })
        if (!res.ok) throw new Error(`Error ${res.status}`)
        return res.json() as Promise<Area[]>
    }, [endpoint])
}
