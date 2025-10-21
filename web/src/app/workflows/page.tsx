'use client'

import * as React from "react";
import AreasTable from "@/components/areas/AreasTable";
import AreasCreationDialog from "@/components/areas/create/areasCreation";

export default function Page() {
    const [refreshKey, setRefreshKey] = React.useState(0);

    // Callback passé au dialog : appelé lorsqu’une area est créée
    const handleCreated = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <main className="py-8 bg-sky-100 space-y-6">
            <div className="flex items-center justify-start gap-3">
                <h1 className="text-4xl">My Workflows</h1>
                <AreasCreationDialog onCreated={handleCreated} />
            </div>

            {/* En passant key, AreasTable sera réinitialisé / rerendu */}
            <AreasTable key={refreshKey} />
        </main>
    );
}
