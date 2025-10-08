"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSession } from "@/hooks/useSession"

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL

export function useSignup() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { setUser } = useSession()

    const signup = async (email: string, password: string) => {
        setLoading(true)
        setError(null)

        if (!email || !password) {
            setLoading(false)
            setError("Veuillez renseigner l'email et le mot de passe.")
            return false
        }

        try {
            const res = await fetch(`${API_BASE}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })


            const ct = res.headers.get("content-type") || ""
            let serverMsg: string | null = null

            if (ct.includes("application/json")) {
                const json = await res.json().catch(() => ({}))
                serverMsg = json?.error ?? null
                if (res.ok) {
                    setUser({ email })
                    router.push("/")
                    return true
                }
            } else {
                const text = await res.text().catch(() => "")
                serverMsg = text || null
            }


            throw new Error(serverMsg || `Impossible de créer le compte (HTTP ${res.status})`)
        } catch (e: any) {
            setError(e?.message ?? "Une erreur est survenue")
            return false
        } finally {
            setLoading(false)
        }
    }

    return { signup, loading, error }
}
