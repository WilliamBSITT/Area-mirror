import { NextResponse } from "next/server"

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "session"
const isProd = process.env.NODE_ENV === "production"

export async function POST() {
    const attrs = [
        "Path=/",
        "HttpOnly",
        `SameSite=${isProd ? "None" : "Lax"}`,
        ...(isProd ? ["Secure"] : []),
        "Max-Age=0",
    ].join("; ")

    const res = new NextResponse(null, { status: 204 })
    res.headers.append("set-cookie", `${COOKIE_NAME}=; ${attrs}`)
    return res
}
