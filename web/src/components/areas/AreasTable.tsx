"use client";

import { useEffect, useState, useMemo } from "react";
import { useAreas } from "@/hooks/areas/useAreas";
import { Area } from "@/types/service"
import { DataTable } from "@/components/areas/create/workflowList";
import { createAreaColumns } from "./columns";

export default function AreasTable() {
    const fetchAreas = useAreas();
    const [data, setData] = useState<Area[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchAreas()
            .then(d => mounted && setData(d))
            .catch(e => mounted && setError(e?.message ?? "Erreur de chargement"))
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, [fetchAreas]);

    const columns = useMemo(() => createAreaColumns(setData), [setData]);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return <DataTable columns={columns} data={data} />;
}
