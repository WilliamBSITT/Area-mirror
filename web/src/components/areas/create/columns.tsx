// components/areas/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Area } from "@/hooks/areas/useAreas";
import { useAreasActivateDeactivate } from "@/hooks/areas/useAreasActivateDeactivate";
import { AreasDeletionDialog } from "@/components/areas/delet/areasDeletion";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function createAreaColumns(
    setAreas: React.Dispatch<React.SetStateAction<Area[]>>
): ColumnDef<Area>[] {
    const Columns: ColumnDef<Area>[] = [
        { accessorKey: "name", header: "Name" },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const area = row.original;
                const router = useRouter();
                const { activate, deactivate, loadingId } = useAreasActivateDeactivate({
                    onMutate: (areaId, enabled) => {
                        setAreas(prev => prev.map(a => (a.id === areaId ? { ...a, enabled } : a)));
                    },
                    onRevalidate: async () => {
                        try {
                            const res = await fetch("/api/areas", { credentials: "include", cache: "no-store" });
                            if (res.ok) {
                                const next = await res.json();
                                setAreas(next);
                            } else {
                                router.refresh();
                            }
                        } catch {
                            router.refresh();
                        }
                    },
                });

                const onChange = async (checked: boolean) => {
                    const prev = Boolean(area.enabled);
                    const tid = toast.loading(checked ? "Activation…" : "Désactivation…");
                    try {
                        const r = await (checked ? activate : deactivate)(area.id);
                        if (!r.ok) throw new Error(r.body?.error ?? "Failed");
                        toast.success(checked ? "Activé" : "Désactivé", {
                            id: tid,
                            description: area.name,
                            action: {
                                label: "Undo",
                                onClick: async () => {
                                    const undoId = toast.loading("Annulation…");
                                    try {
                                        const r2 = await (prev ? activate : deactivate)(area.id);
                                        if (!r2.ok) throw new Error(r2.body?.error ?? "Failed");
                                        toast.success("Annulé", { id: undoId, description: area.name });
                                    } catch (e: any) {
                                        toast.error(e?.message ?? "Échec de l’annulation", { id: undoId });
                                    }
                                },
                            },
                        });
                    } catch (e: any) {
                        setAreas(prevArr => prevArr.map(a => (a.id === area.id ? { ...a, enabled: prev } : a)));
                        toast.error(e?.message ?? "Échec de la mise à jour", { id: tid });
                    }
                };

                const onDelete = async () => {
                    const tid = toast.loading("Suppression…");
                    try {
                        const res = await fetch(`/api/areas/${area.id}`, {
                            method: "DELETE",
                            credentials: "include",
                            headers: { Accept: "application/json" },
                            cache: "no-store",
                        });
                        if (!res.ok) {
                            const msg = await res.text();
                            throw new Error(msg || `Erreur ${res.status}`);
                        }
                        setAreas(prev => prev.filter(a => a.id !== area.id));
                        toast.success("Supprimé", { id: tid, description: area.name });
                    } catch (e: any) {
                        toast.error(e?.message ?? "Échec de la suppression", { id: tid });
                        throw e;
                    }
                };

                return (
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={Boolean(area.enabled)}
                            disabled={loadingId === area.id}
                            onCheckedChange={onChange}
                            aria-label={`Toggle ${area.name}`}
                        />
                        <AreasDeletionDialog onConfirm={onDelete}>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Supprimer ${area.name}`}
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AreasDeletionDialog>
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ];
    return Columns;
}
