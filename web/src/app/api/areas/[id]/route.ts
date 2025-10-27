import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!
const COOKIE_NAME = "session";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Récupère les détails de l'area depuis ta base de données
        // Exemple avec ton backend
        const areaId = params.id;

        // Appel à ton backend pour récupérer les données
        const response = await fetch(`${process.env.BACKEND_URL}/areas/${areaId}`, {
            headers: {
                Cookie: request.headers.get("cookie") || "",
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Area not found" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch area" },
            { status: 500 }
        );
    }
}

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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const be = await fetch(`${BACKEND_URL}/areas/${params.id}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
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
