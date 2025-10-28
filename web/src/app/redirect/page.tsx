import Link from "next/link";
import {Button} from "@/components/ui/button";

const commonClassName = "sm:text-4xl md:text-4xl lg:text-4xl xl:text-4xl 2xl:text-4xl"

// pc : lg:text-...
// tv : 2xl:text-...
// mobile :

export default function Page() {
    return (
        <main className="flex flex-col justify-center items-center py-20 text-center">
            <h1 className="sm:text-9xl md:text-9xl lg:text-2xl xl:text-2xl 2xl:text-5xl">
                If you want to access this page you have to be connected
            </h1>

            <div className="mt-10 flex items-center space-x-2">
                <h1 className="commonClassName">Would you like to</h1>
                <Button asChild>
                    <Link href="/login">Login</Link>
                </Button>
                <h1 className="commonClassName">or</h1>
                <Button asChild>
                    <Link href="/">Go back</Link>
                </Button>
            </div>
        </main>
    );
}

