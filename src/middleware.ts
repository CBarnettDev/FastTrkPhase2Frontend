import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // SKIP MIDDLEWARE FOR API ROUTES - Let them proxy to backend
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Define route categories
  const protectedRoutes = ["/dashboard", "/vehicles"];
  const authRoutes = ["/login", "/signup"];
  const publicRoutes = ["/", "/about", "/contact"];

  // Check route categories
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isAuthRoute = authRoutes.includes(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  // Handle protected routes
  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set(
        "from",
        pathname +
          (searchParams.toString() ? `?${searchParams.toString()}` : "")
      );
      return NextResponse.redirect(loginUrl);
    }

    // SIMPLIFIED: Just check if token exists, let backend handle validation
    return NextResponse.next();
  }

  // Handle auth routes (login/signup) for users who might be authenticated
  if (isAuthRoute && token) {
    // Make a simple request to backend to verify token
    try {
      const response = await fetch(`http://localhost:3002/api/auth/me`, {
        headers: {
          Cookie: `token=${token}`,
        },
      });

      if (response.ok) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        // Token is invalid, clear it and allow access to auth page
        const response = NextResponse.next();
        response.cookies.delete("token");
        return response;
      }
    } catch (error) {
      // Network error or backend down - allow access but don't clear token
      return NextResponse.next();
    }
  }

  // Handle public routes
  if (isPublicRoute) {
    const response = NextResponse.next();
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    return response;
  }

  // Allow all other routes to pass through
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - These will be proxied to backend
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
