import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "tilestore_session";

function decodeSession(encoded: string) {
  try {
    const jsonStr = atob(encoded);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  const session = cookie ? decodeSession(cookie) : null;

  // Protect Admin routes
  if (pathname.startsWith("/admin")) {
    if (!session || (session.role !== "Admin" && session.role !== "Super Admin")) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect Customer routes
  if (pathname.startsWith("/customer")) {
    if (!session || session.role !== "Customer") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect already authenticated users from login/register
  if (pathname === "/login" || pathname === "/register") {
    if (session) {
      if (session.role === "Admin" || session.role === "Super Admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else if (session.role === "Customer") {
        return NextResponse.redirect(new URL("/customer/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/customer/:path*",
    "/login",
    "/register",
  ],
};
