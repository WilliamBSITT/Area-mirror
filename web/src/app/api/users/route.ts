import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL
const USER_ID = "user_id"
const JWT = "session";

export async function GET(req: NextRequest) {
    const jwt = req.cookies.get(JWT)?.value
    if (!jwt) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }

    const id = req.cookies.get(USER_ID)?.value
    if (!id) {
        return NextResponse.json({ error: "unauthorized" })
    }

    const be = await fetch(`${BACKEND_URL}/users/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${jwt}`,
            Accept: "application/json"
        },
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