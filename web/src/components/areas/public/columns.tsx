'use client';

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Area } from "@/types/service";
import { AreasCpyDialog } from "@/components/areas/public/areasCpy"

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
