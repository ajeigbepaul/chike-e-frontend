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
  // Skip static files with extensions
  if (/\.[^\/]+$/.test(path)) {
    return NextResponse.next();
  }
  console.log("=== MIDDLEWARE DEBUG ===");
  console.log("Middleware processing path:", path);
  console.log("Full URL:", request.url);

  // Allow access to public paths and API routes
  const isPublicRoute = 
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/static") ||
    path.startsWith("/favicon.ico") ||
    path === "/" ||
    path === "/about" ||
    path === "/contactus" ||
    path === "/faq" ||
    path === "/termofuse" ||
    path === "/privacypolicy" ||
    path === "/products" ||
    path.startsWith("/products") ||
    path.startsWith("/product") ||
    path.startsWith("/category") ||
    path.startsWith("/category/[slug]") ||
    path.startsWith("/tag") ||
    path.startsWith("/tag/[slug]") ||
    path === "/checkout" ||
    path.startsWith("/checkout") ||
    path === "/cart" ||
    path.startsWith("/cart") ||
    path === "/orders" ||
    path.startsWith("/orders") ||
    path === "/account" ||
    path.startsWith("/account") ||
    path.startsWith("/auth/") ||
    (path.startsWith("/vendor/onboarding") &&
      new URL(request.url).searchParams.has("token"));
      
  if (isPublicRoute) {
    console.log("Path is in public routes, allowing access");
    console.log("Specific match for checkout:", path === "/checkout" || path.startsWith("/checkout"));
    return NextResponse.next();
  }

  // Get the token with multiple fallback methods
  let token = null;

  try {
    // Method 1: Standard getToken
    token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    console.log("Method 1 (getToken) result:", token ? "Success" : "Failed");
  } catch (error) {
    console.log("Method 1 (getToken) error:", error);
  }

  // Method 2: Try with different cookie names
  if (!token) {
    try {
      const sessionToken = request.cookies.get(
        "next-auth.session-token"
      )?.value;
      const secureSessionToken = request.cookies.get(
        "__Secure-next-auth.session-token"
      )?.value;

      console.log("Session token exists:", !!sessionToken);
      console.log("Secure session token exists:", !!secureSessionToken);

      if (sessionToken || secureSessionToken) {
        // Try getToken again with explicit cookie
        token = await getToken({
          req: request,
          secret: process.env.NEXTAUTH_SECRET,
          secureCookie: process.env.NODE_ENV === "production",
        });
        console.log(
          "Method 2 (explicit cookie) result:",
          token ? "Success" : "Failed"
        );
      }
    } catch (error) {
      console.log("Method 2 (explicit cookie) error:", error);
    }
  }

  console.log("Final token status:", token ? "Present" : "Missing");
  console.log(
    "Token details:",
    token
      ? {
          role: token.role,
          exp: token.exp,
          iat: token.iat,
          id: token.id,
        }
      : "No token"
  );

  // Debug: Log all cookies to see what's available
  console.log("All cookies:", request.cookies.getAll());

  // Handle auth pages - let NextAuth handle redirects
  if (path.startsWith("/auth/")) {
    console.log("Auth page access, allowing NextAuth to handle");
    return NextResponse.next();
  }

  // Handle protected routes
  if (!token) {
    // Allow index page to be accessed without authentication
    if (path === "/") {
      console.log("No token but accessing index page, allowing");
      return NextResponse.next();
    }

    // Allow public routes even without token
    if (
      path.startsWith("/products") ||
      path.startsWith("/product") ||
      path.startsWith("/category") ||
      path.startsWith("/category/[slug]") ||
      path === "/about" ||
      path.startsWith("/cart") ||
      path.startsWith("/checkout")
    ) {
      console.log("No token but accessing public route, allowing");
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
  console.log("Current path:", path);

  // Special handling for admin routes
  if (path.startsWith("/admin")) {
    // If no token but we're in production, allow access (temporary fix)
    if (!token && process.env.NODE_ENV === "production") {
      console.log("Production: Token missing but allowing admin route access");
      return NextResponse.next();
    }

    // If we have a token, check the role
    if (token && userRole !== "admin") {
      console.log("Non-admin user trying to access admin route");
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // If no token at all, redirect to login
    if (!token) {
      console.log("No token for admin route, redirecting to login");
      const url = new URL("/auth/signin", request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    console.log("Admin accessing admin route, allowing");
    return NextResponse.next();
  }

  // Special handling for vendor routes
  if (path.startsWith("/vendor") && !path.startsWith("/vendor/onboarding")) {
    if (userRole !== "vendor") {
      console.log("Non-vendor user trying to access vendor route");
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    console.log("Vendor accessing vendor route, allowing");
    return NextResponse.next();
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

  console.log("Allowing access to route");
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
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
