"use client"

import { useEffect, useState } from "react"
import { useAreas, Area } from "@/hooks/useAreas"
import { DataTable } from "@/components/areas/workflowList"
import { areaColumns } from "./columns"

export default function AreasTable() {
    const fetchAreas = useAreas()
    const [data, setData] = useState<Area[] | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        setLoading(true)
        fetchAreas()
            .then(d => mounted && setData(d))
            .catch(e => mounted && setError(e?.message ?? "Erreur de chargement"))
            .finally(() => mounted && setLoading(false))
        return () => {
            mounted = false
        }
    }, [fetchAreas])

    if (loading) return <div>Chargement...</div>
    if (error) return <div className="text-red-600">{error}</div>
    if (!data) return <div>Aucune donnée</div>

    return <DataTable columns={areaColumns} data={data} />
}
