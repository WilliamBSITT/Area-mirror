'use client';

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Area } from "@/types/service";
import { useAreasActivateDeactivate } from "@/hooks/areas/useAreasActivateDeactivate";
import { AreasDeletionDialog } from "@/components/areas/delete/areasDeletion";
import { AreasCpyDialog } from "@/components/areas/public/areasCpy"
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
                return (
                    <div className="flex items-center gap-2">
                        <AreasCpyDialog areaId={area.id}/>
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ];
    return Columns;
}
