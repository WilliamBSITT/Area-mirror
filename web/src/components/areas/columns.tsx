'use client';

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Area } from "@/types/service";
import { useAreasActivateDeactivate } from "@/hooks/areas/useAreasActivateDeactivate";
import { AreasDeletionDialog } from "@/components/areas/delete/areasDeletion";
import { AreasUpdateDialog } from "@/components/areas/update/areasUpdate"
import { useRouter } from "next/navigation";
import { Trash2, Pencil} from "lucide-react";
import AreasCreationDialog from "@/components/areas/create/areasCreation";

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
                    const tid = toast.loading(checked ? "Activating…" : "Deactivating…");
                    try {
                        const r = await (checked ? activate : deactivate)(area.id);
                        if (!r.ok) throw new Error(r.body?.error ?? "Failed");
                        toast.success(checked ? "Activated" : "Deactivated", {
                            id: tid,
                            description: area.name,
                            action: {
                                label: "Undo",
                                onClick: async () => {
                                    const undoId = toast.loading("Canceling…");
                                    try {
                                        const r2 = await (prev ? activate : deactivate)(area.id);
                                        if (!r2.ok) throw new Error(r2.body?.error ?? "Failed");
                                        toast.success("Canceled", { id: undoId, description: area.name });
                                    } catch (e: any) {
                                        toast.error(e?.message ?? "Failed to cancel", { id: undoId });
                                    }
                                },
                            },
                        });
                    } catch (e: any) {
                        setAreas(prevArr => prevArr.map(a => (a.id === area.id ? { ...a, enabled: prev } : a)));
                        toast.error(e?.message ?? "Update failed", { id: tid });
                    }
                };

                const onDelete = async () => {
                    const tid = toast.loading("Deleting…");
                    try {
                        const res = await fetch(`/api/areas/${area.id}`, {
                            method: "DELETE",
                            credentials: "include",
                            headers: { Accept: "application/json" },
                            cache: "no-store",
                        });
                        if (!res.ok) {
                            const msg = await res.text();
                            throw new Error(msg || `Error ${res.status}`);
                        }
                        setAreas(prev => prev.filter(a => a.id !== area.id));
                        toast.success("Deleted", { id: tid, description: area.name });
                    } catch (e: any) {
                        toast.error(e?.message ?? "Deletion failed", { id: tid });
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
                        <AreasUpdateDialog areaId={area.id} />
                        <AreasDeletionDialog onConfirm={onDelete}>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Delete ${area.name}`}
                                className="text-destructive hover:text-destructive"
                                id={`delete-area-button-${area.id}`}
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
