import { createContext } from "react"

export type SessionUser = {
    id?: string
    email: string
    name?: string
    avatarUrl?: string
} | null

export type SessionContextValue = {
    user: SessionUser
    loading: boolean
    setUser: (u: SessionUser) => void
    refresh: () => Promise<void>
}

export const SessionContext = createContext<SessionContextValue | undefined>(undefined)
