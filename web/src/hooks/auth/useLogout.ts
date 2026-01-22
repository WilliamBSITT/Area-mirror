"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSession } from "@/hooks/useSession"

export function useLogout() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { setUser } = useSession()

    const logout = async () => {
        if (loading) return false
        setLoading(true); setError(null)
        try {
            await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
            setUser(null);
            router.push("/login")
            return true
        } catch (e:any) {
            setError(e?.message ?? "Échec de la déconnexion")
            return false
        } finally {
            setLoading(false)
        }
    }

    return { logout, loading, error }
}
