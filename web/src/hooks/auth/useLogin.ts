"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSession } from "@/hooks/useSession"

export function useLogin() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { refresh } = useSession()

    const login = async (email: string, password: string) => {
        if (loading) return false
        setLoading(true); setError(null)
        try {
            if (!email || !password) throw new Error("Please enter your email and password.")

            const res = await fetch("/api/auth/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            })

            if (!res.ok) {
                const txt = await res.text().catch(() => "")
                let msg = `Error ${res.status}`
                try { const j = JSON.parse(txt); msg = (j?.error ?? j?.message ?? txt) || msg } catch { msg = txt || msg }
                throw new Error(msg || "Invalid credentials")
            } else {
                const data = await res.json();
            }

            await refresh()
            router.push("/")
            return true
        } catch (e:any) {
            setError(e?.message ?? "An error occurred")
            return false
        } finally {
            setLoading(false)
        }
    }

    return { login, loading, error, resetError: () => setError(null) }
}
