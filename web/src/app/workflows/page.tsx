import Link from "next/link"
import { Button } from "@/components/ui/button"
import AreasTable from "@/components/AreasTable"
import {PlusIcon} from "lucide-react";

export default function Page() {
    return (
        <main className="py-8 bg-sky-100 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl">My Workflows</h1>
                <Button variant="outline" size="icon" aria-label="Submit">
                    <PlusIcon />
                </Button>
            </div>
            <AreasTable />
        </main>
    )
}
