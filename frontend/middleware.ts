import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
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

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin", "/admin/:path*"],
};
