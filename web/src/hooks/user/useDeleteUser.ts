"use client"

import { useCallback } from "react"

export function useDeleteUser(endpoint = "/api/users") {
    return useCallback(async () => {
        const res = await fetch(endpoint, {
            method: "DELETE",
            credentials: "include",
            headers: { Accept: "application/json" },
            cache: "no-store",
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || `Erreur ${res.status}`)
        }

        return res.json()
    }, [endpoint])
}