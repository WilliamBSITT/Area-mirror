"use client"

import { useSession } from "@/hooks/useSession"

export const useAuthLoading = () => useSession().loading
export const useIsAuthenticated = () => useSession().user !== null
