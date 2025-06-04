// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Role-based route configuration
const protectedRoutes: Record<string, string[]> = {
  // Admin routes
  "/admin": ["admin"],
  "/admin/dashboard": ["admin"],
  "/admin/users": ["admin"],
  "/admin/orders": ["admin"],
  "/admin/reports": ["admin"],
  "/admin/reports/sales": ["admin"],
  "/admin/users/:id": ["admin"],
  "/admin/orders/:id": ["admin"],

  // User routes - allow both user and admin roles
  // Index route is public and accessible to all
  "/profile": ["user", "admin", "vendor"],

  // Vendor routes
  "/vendor/dashboard": ["vendor"],
  "/vendor/products": ["vendor"],
  "/vendor/orders": ["vendor"],
  "/vendor/settings": ["vendor"],
  "/vendor/stats": ["vendor"],
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log("Middleware processing path:", path);

  // Allow access to public paths and API routes
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/static") ||
    path.startsWith("/favicon.ico") ||
    path === "/" || // Allow access to index page
    (path.startsWith("/vendor/onboarding") && new URL(request.url).searchParams.has("token")) // Allow access to vendor onboarding with token
  ) {
    return NextResponse.next();
  }

  // Get the token
  const token = await getToken({ req: request });
  console.log("Token status:", token ? "Present" : "Missing");

  // Handle auth pages
  if (path.startsWith("/auth/")) {
    if (token) {
      // If user is authenticated and trying to access auth pages
      console.log(
        "User is already authenticated, redirecting based on role:",
        token.role
      );

      // Redirect based on role
      if (token.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else if (token.role === "vendor") {
        return NextResponse.redirect(new URL("/vendor/dashboard", request.url));
      }
      // For regular users, send them to the homepage
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (!token) {
    // Allow index page to be accessed without authentication
    if (path === "/") {
      return NextResponse.next();
    }

    console.log("No token found, redirecting to login");
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Check token expiration
  if (
    token.exp &&
    typeof token.exp === "number" &&
    token.exp * 1000 < Date.now()
  ) {
    console.log("Token expired, redirecting to login");
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("error", "TokenExpired");
    return NextResponse.redirect(url);
  }

  // Get user role from token
  const userRole = token.role as string;
  console.log("User role for protected route:", userRole);

  // Special handling for admin routes
  if (path.startsWith("/admin")) {
    if (userRole !== "admin") {
      console.log("Non-admin user trying to access admin route");
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    return NextResponse.next();
  }

  // Special handling for vendor routes
  if (path.startsWith("/vendor") && !path.startsWith("/vendor/onboarding")) {
    if (userRole !== "vendor") {
      console.log("Non-vendor user trying to access vendor route");
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    return NextResponse.next();
  }

  // Redirect admin users to admin dashboard if they try to access non-admin routes
  // But allow them to access the index route (homepage)
  if (userRole === "admin" && !path.startsWith("/admin") && path !== "/") {
    console.log(
      "Admin user accessing non-admin route, redirecting to admin dashboard"
    );
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Redirect vendor users to vendor dashboard if they try to access non-vendor routes
  // But allow them to access the index route (homepage)
  if (userRole === "vendor" && !path.startsWith("/vendor") && path !== "/") {
    console.log(
      "Vendor user accessing non-vendor route, redirecting to vendor dashboard"
    );
    return NextResponse.redirect(new URL("/vendor/dashboard", request.url));
  }

  // For non-admin routes, check against protected routes
  const [matchingRoute, params] = findMatchingRoute(path);

  if (matchingRoute) {
    const allowedRoles = protectedRoutes[matchingRoute];
    if (!allowedRoles.includes(userRole)) {
      console.log("User role not allowed for route");
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

// Helper function to match dynamic routes
function findMatchingRoute(
  path: string
): [string | null, Record<string, string> | null] {
  const pathSegments = path.split("/").filter(Boolean);
  const params: Record<string, string> = {};

  for (const route in protectedRoutes) {
    const routeSegments = route.split("/").filter(Boolean);

    if (routeSegments.length !== pathSegments.length) continue;

    let match = true;
    for (let i = 0; i < routeSegments.length; i++) {
      if (routeSegments[i].startsWith(":")) {
        params[routeSegments[i].slice(1)] = pathSegments[i];
      } else if (routeSegments[i] !== pathSegments[i]) {
        match = false;
        break;
      }
    }

    if (match) {
      return [route, params];
    }
  }

  return [null, null];
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
