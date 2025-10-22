import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "session";

export const config = {
    matcher: ["/workflows", "/workflows/:path*", "/profile", "/profile/:path*", "/settings", "/settings/:path*"],
};

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (!pathname.startsWith("/workflows")) {
        return NextResponse.next();
    }

    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
        return NextResponse.redirect(new URL("/redirect", req.url));
    }

    try {
        const res = await fetch(`${req.nextUrl.origin}/api/auth/auth`, {
            method: "GET",
            headers: {
                cookie: req.headers.get("cookie") || "",
            },
        });

        if (res.status !== 200) {
            return NextResponse.redirect(new URL("/redirect", req.url));
        }
    } catch {
        return NextResponse.redirect(new URL("/redirect", req.url));
    }

    return NextResponse.next();
}
