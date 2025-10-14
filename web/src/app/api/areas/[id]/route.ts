import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!
const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "session";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const body = await req.json();
    const be = await fetch(`${BACKEND_URL}/areas/${params.id}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    const text = await be.text();
    const res = new NextResponse(text, {
        status: be.status,
        headers: {
            "Content-Type": be.headers.get("content-type") ?? "application/json",
            "Cache-Control": "no-store, private",
            Vary: "Cookie",
        },
    });

    const beSetCookie = be.headers.get("set-cookie");
    if (beSetCookie) for (const c of beSetCookie.split(/,(?=[^;]+?=)/)) res.headers.append("set-cookie", c.trim());

    return res;
}
