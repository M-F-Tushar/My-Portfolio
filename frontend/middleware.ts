import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ratelimit } from "./lib/ratelimit";

export async function middleware(req: NextRequest) {
    // Fail-open: if anything crashes, let the request pass
    try {
        if (req.nextUrl.pathname.startsWith("/api/")) {
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
        }
    } catch (error) {
        console.error("Middleware error (Fail Open):", error);
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/api/:path*",
};
