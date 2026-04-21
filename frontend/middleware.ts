import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ratelimit } from "./lib/ratelimit";
import { SESSION_COOKIE, verifyAdminSession } from "./lib/auth/session";

function redirectToAdminLogin(req: NextRequest) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("next", `${req.nextUrl.pathname}${req.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
}

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/admin")) {
        if (pathname === "/admin/login") {
            return NextResponse.next();
        }

        try {
            const token = req.cookies.get(SESSION_COOKIE)?.value;
            const session = token ? await verifyAdminSession(token) : null;

            if (!session) {
                return redirectToAdminLogin(req);
            }
        } catch (error) {
            console.error("Admin middleware auth error:", error);
            return redirectToAdminLogin(req);
        }
    }

    if (pathname.startsWith("/api/")) {
        // Fail-open for legacy API rate limiting.
        try {
            const ip = req.ip ?? "127.0.0.1";
            // const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

            const { success, limit, reset, remaining } = await ratelimit.limit(ip);

            if (!success) {
                return new NextResponse("Too Many Requests", {
                    status: 429,
                    headers: {
                        "X-RateLimit-Limit": limit.toString(),
                        "X-RateLimit-Remaining": remaining.toString(),
                        "X-RateLimit-Reset": reset.toString(),
                    },
                });
            }

            const res = NextResponse.next();
            res.headers.set("X-RateLimit-Limit", limit.toString());
            res.headers.set("X-RateLimit-Remaining", remaining.toString());
            res.headers.set("X-RateLimit-Reset", reset.toString());
            return res;
        } catch (error) {
            console.error("Middleware error (Fail Open):", error);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*", "/admin", "/admin/:path*"],
};
