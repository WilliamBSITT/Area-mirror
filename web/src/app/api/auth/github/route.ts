import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL!;
const COOKIE_NAME = "session";
const isProd = process.env.NODE_ENV === "production";

function cookieFromToken(token: string, maxAgeSec = 7 * 24 * 3600) {
    const attrs = [
        "Path=/",
        "HttpOnly",
        `SameSite=${isProd ? "None" : "Lax"}`,
        ...(isProd ? ["Secure"] : []),
        `Max-Age=${maxAgeSec}`,
    ].join("; ");
    return `${COOKIE_NAME}=${token}; ${attrs}`;
}

export async function POST(req: NextRequest) {
    const bodyText = await req.text();

    const be = await fetch(`${BACKEND_URL}/auth/github/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: bodyText,
    });

    const text = await be.text();

    const res = new NextResponse(text, {
        status: be.status,
        headers: {
            "Content-Type": be.headers.get("content-type") ?? "application/json",
            "Cache-Control": "no-store",
            Vary: "Cookie",
        },
    });

    const beSetCookie = be.headers.get("set-cookie");
    if (beSetCookie) {
        res.headers.set("set-cookie", beSetCookie);
        return res;
    }

    try {
        const payload = JSON.parse(text);
        const token = payload?.token ?? payload?.access_token ?? payload?.jwt;
        if (token) res.headers.append("set-cookie", cookieFromToken(token));
    } catch {
    }

    return res;
}
