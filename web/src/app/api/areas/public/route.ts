import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL!
const COOKIE_NAME = "session"

export async function GET(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }

    const be = await fetch(`${BACKEND_URL}/areas/public`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        cache: "no-store",
    })

    const text = await be.text()
    const res = new NextResponse(text, {
        status: be.status,
        headers: {
            "Content-Type": be.headers.get("content-type") ?? "application/json",
            "Cache-Control": "no-store, private",
            Vary: "Cookie",
        },
    })

    const beSetCookie = be.headers.get("set-cookie")
    if (beSetCookie) {
        for (const c of beSetCookie.split(/,(?=[^;]+?=)/)) res.headers.append("set-cookie", c.trim())
    }

    return res
}
