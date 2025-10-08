"use client"
import { useEffect, useState } from "react"
import { SessionContext, type SessionUser } from "@/context/session-contexte"

export default function SessionProvider({
                                            children,
                                            initialUser = null,
                                            autoRefresh = true,
                                        }: { children: React.ReactNode; initialUser?: SessionUser; autoRefresh?: boolean }) {

    const [user, setUser] = useState<SessionUser>(initialUser)
    const [loading, setLoading] = useState(true)

    const refresh = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/auth/auth/", { method: "GET", credentials: "include" })
            setUser(res.ok ? { email: "" } : null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { autoRefresh ? void refresh() : setLoading(false) }, [autoRefresh])

    return (
        <SessionContext.Provider value={{ user, loading, setUser, refresh }}>
            {children}
        </SessionContext.Provider>
    )
}
