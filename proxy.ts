import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = nextUrl.pathname.startsWith("/shared");
  const isAuthRoute = ["/login", "/register"].includes(nextUrl.pathname);
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  if (isApiAuthRoute) return NextResponse.next();

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export default proxy;

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
