'use client'

import * as React from "react";
import AreasTable from "@/components/areas/AreasTable";
import AreasCreationDialog from "@/components/areas/create/areasCreation";

export default function Page() {
    const [refreshKey, setRefreshKey] = React.useState(0);

    const handleCreated = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <main className="py-8 px-20 space-y-6">
            <div className="flex items-center justify-start gap-3">
                <h1 className="text-4xl">My Workflows</h1>
                <AreasCreationDialog onCreated={handleCreated} />
            </div>
            <AreasTable key={refreshKey} />
        </main>
    );
}
