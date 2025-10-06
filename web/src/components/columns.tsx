"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Area } from "@/hooks/useAreas"

async function toggleArea(id: number, enabled: boolean) {
    // Exemple: appel BFF
    const res = await fetch(`/api/areas/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ enabled }),
    })
    if (!res.ok) {
        const msg = await res.text().catch(() => `Erreur ${res.status}`)
        throw new Error(msg || `Erreur ${res.status}`)
    }
}

export const areaColumns: ColumnDef<Area>[] = [
    { accessorKey: "name", header: "Name" },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const area = row.original
            const current = Boolean(area.enabled)

            const onChange = async (checked: boolean) => {
                const previous = current

                // Toast « en cours »
                const tid = toast.loading(checked ? "Activation…" : "Désactivation…")

                try {
                    await toggleArea(area.id, checked)
                    toast.success(checked ? "Activé" : "Désactivé", {
                        id: tid,
                        description: area.name,
                        action: {
                            label: "Undo",
                            onClick: async () => {
                                const undoId = toast.loading("Annulation…")
                                try {
                                    await toggleArea(area.id, previous)
                                    toast.success("Annulé", { id: undoId, description: area.name })
                                } catch (e: any) {
                                    toast.error(e?.message ?? "Échec de l’annulation", { id: undoId })
                                }
                            },
                        },
                    })
                } catch (e: any) {
                    toast.error(e?.message ?? "Échec de la mise à jour", { id: tid })
                }
            }

            return (
                <Switch
                    defaultChecked={current}
                    onCheckedChange={onChange}
                    aria-label={`Toggle ${area.name}`}
                />
            )
        },
        enableSorting: false,
        enableHiding: false,
    },
]
