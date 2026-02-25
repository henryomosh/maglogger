import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/seed"];
const publicRoutes = ["/signup", "/"];
const lockedRoutes = ["/"];

export async function middleware(request: NextRequest) {
  // Check if the current route is protected or public
  const path = request.nextUrl.pathname;
  const isProtectedRoute =
    protectedRoutes.includes(path) || path.startsWith("/dashboard");
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = (await cookies()).get("session")?.value;

  if (isPublicRoute && !cookie) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
  if (isProtectedRoute && !cookie) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
    // return NextResponse.redirect(new URL("/locked", request.nextUrl));
  }

  if (cookie && !isProtectedRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    // return NextResponse.redirect(new URL("/locked", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
