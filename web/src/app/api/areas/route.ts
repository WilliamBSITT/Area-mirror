import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL!
const COOKIE_NAME = "session"

export async function GET(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }

    const be = await fetch(`${BACKEND_URL}/areas`, {
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

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
    const { id } = ctx.params;
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const be = await fetch(`${BACKEND_URL}/areas/${id}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
    });
}

export async function POST(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json();

        if (!body.name || !body.action || !body.reaction) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        const res = await fetch(`${BACKEND_URL}/areas`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const msg = await res.text();
            return NextResponse.json(
                { error: `Backend error: ${msg || res.statusText}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data, { status: 201 });
    } catch (err: unknown) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Unknown error" },
            { status: 500 }
        );
    }
}
