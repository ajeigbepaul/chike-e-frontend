// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Role-based route configuration
const protectedRoutes: Record<string, string[]> = {
  // Static routes
  "/admin": ["admin"],
  "/dashboard": ["admin", "manager", "user"], // Updated to include user role
  "/profile": ["admin", "manager", "user"],

  // Dynamic routes - use :param format
  "/users/:id": ["admin", "manager"], // User management
  "/projects/:projectId": ["admin", "manager", "user"], // Project access
  "/organizations/:orgId/settings": ["admin"], // Org settings
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log("Middleware processing path:", path);
  console.log("Search params:", request.nextUrl.search);

  // Allow access to public paths and API routes
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/static") ||
    path.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Check for verification parameters
  const hasVerificationParams =
    request.nextUrl.search.includes("verified=") ||
    request.nextUrl.search.includes("registered=") ||
    request.nextUrl.search.includes("error=");

  // Allow access to auth pages with verification parameters
  if (path.startsWith("/auth/") && hasVerificationParams) {
    console.log("Allowing access to auth page with verification parameter");
    return NextResponse.next();
  }

  // Get the token
  const token = await getToken({ req: request });
  console.log("Token status:", token ? "Present" : "Missing");

  // Handle auth pages
  if (path.startsWith("/auth/")) {
    if (token) {
      // If user is authenticated and trying to access auth pages
      // Only redirect if not in verification flow
      if (!hasVerificationParams) {
        console.log("Redirecting authenticated user from auth page");
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (!token) {
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

  // Check role-based access for protected routes
  const userRole = token.role as string;

  // Check if user email is verified (if applicable)
  const isVerified = token.isVerified !== false; // Default to true if not specified

  // If verification is required for this route and user is not verified
  if (!isVerified && !path.includes("/auth/verify")) {
    console.log("User not verified, redirecting to signin");
    // Redirect to a page that informs the user they need to verify their email
    return NextResponse.redirect(
      new URL("/auth/signin?error=VerificationRequired", request.nextUrl)
    );
  }

  // Find matching route pattern
  const [matchingRoute, params] = findMatchingRoute(path);

  if (matchingRoute) {
    const allowedRoles = protectedRoutes[matchingRoute];

    // Check if user has required role
    if (!allowedRoles.includes(userRole)) {
      console.log("User role not allowed, redirecting to unauthorized");
      return NextResponse.redirect(new URL("/unauthorized", request.nextUrl));
    }

    // Additional resource ownership checks
    if (matchingRoute.startsWith("/users/") && params?.id) {
      const userId: string = String(token.id);
      const resourceId: string = String(params.id);
      if (!(await checkUserAccess(userId, resourceId, userRole))) {
        console.log("User access denied, redirecting to unauthorized");
        return NextResponse.redirect(new URL("/unauthorized", request.nextUrl));
      }
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
        // It's a parameter - store the value
        const paramName = routeSegments[i].slice(1);
        params[paramName] = pathSegments[i];
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

// Resource ownership check
async function checkUserAccess(
  userId: string,
  resourceId: string,
  userRole: string
): Promise<boolean> {
  // Admins can access everything
  if (userRole === "admin") return true;

  // Managers can access all user resources
  if (userRole === "manager") return true;

  // Regular users can only access their own resources
  return userId === resourceId;
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
