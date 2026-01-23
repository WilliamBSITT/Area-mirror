'use client'

import * as React from "react";
import AreasTable from "@/components/areas/public/areasTable";

export default function Page() {
    const [refreshKey] = React.useState(0);

    return (
        <main className="py-8 px-20 space-y-6">
            <div className="flex items-center justify-start gap-3">
                <h1 className="text-4xl">Public Workflows</h1>
            </div>
            <AreasTable key={refreshKey} />
        </main>
    );
}
