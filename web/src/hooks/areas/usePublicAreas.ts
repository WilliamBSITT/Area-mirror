"use client"

import { useCallback } from "react"
import { AreaPublic } from "@/types/publicService"

export function usePublicAreas(endpoint = "/api/areas/public") {
    return useCallback(async () => {
        const res = await fetch(endpoint, {
            method: "GET",
            credentials: "include",
            headers: { Accept: "application/json" },
            cache: "no-store",
        })
        if (!res.ok) throw new Error(`Error ${res.status}`)
        return res.json() as Promise<AreaPublic[]>
    }, [endpoint])
}
