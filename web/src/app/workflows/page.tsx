import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function Page() {
    return (
        <main className="py-8 bg-sky-100">
            <h1 className="text-4xl">
                My Workflows
            </h1>
            <Button asChild className="bg-indigo-800 text-white">
                <Link href="/addworkflow">+</Link>
            </Button>
        </main>
    );
}
