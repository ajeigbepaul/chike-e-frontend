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

  // User routes
  "/profile": ["user", "admin", "vendor"],
  "/orders": ["user", "admin", "vendor"],
  "/account": ["user", "admin", "vendor"],

  // Vendor routes
  "/vendor/dashboard": ["vendor"],
  "/vendor/products": ["vendor"],
  "/vendor/orders": ["vendor"],
  "/vendor/settings": ["vendor"],
  "/vendor/stats": ["vendor"],
  
  // Checkout requires authentication (any authenticated role)
  "/checkout": ["user", "admin", "vendor"],
};

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/about",
  "/contactus",
  "/faq",
  "/termofuse",
  "/privacypolicy",
  "/products",
  "/product/[slug]",
  "/category/[slug]",
  "/tag/[slug]",
  "/cart", // ✅ Cart remains public - users can view without auth
  "/auth/signin",
  "/auth/signup",
  "/auth/forgot-password",
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Skip static files with extensions
  if (/\.[^\/]+$/.test(path)) {
    return NextResponse.next();
  }
  
  console.log("=== MIDDLEWARE DEBUG ===");
  console.log("Middleware processing path:", path);
  console.log("Full URL:", request.url);

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => {
    if (route.includes('[slug]')) {
      // Handle dynamic routes like /product/[slug]
      const basePattern = route.replace('/[slug]', '');
      return path.startsWith(basePattern) && path.split('/').length === 3;
    }
    return path === route || path.startsWith(route + '/');
  });

  // Allow public routes (including API routes, static files, etc.)
  if (isPublicRoute || 
      path.startsWith("/_next") ||
      path.startsWith("/api") ||
      path.startsWith("/static")) {
    console.log("Public route access allowed:", path);
    return NextResponse.next();
  }

  // Special handling for vendor onboarding with token
  if (path.startsWith("/vendor/onboarding")) {
    const hasToken = new URL(request.url).searchParams.has("token");
    if (!hasToken) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    console.log("Vendor onboarding with token allowed");
    return NextResponse.next();
  }

  // Get the token with multiple fallback methods (preserving your robust checking)
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

  // Method 2: Try with different cookie names (your production-safe check)
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

  // Handle auth pages
  if (path.startsWith("/auth/")) {
    console.log("Auth page access");
    
    // If user is already authenticated and tries to access auth pages, redirect them back
    if (token) {
      const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
      const returnUrl = callbackUrl || '/';
      console.log("Already authenticated, redirecting to:", returnUrl);
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }
    
    return NextResponse.next();
  }

  // 🔑 KEY IMPROVEMENT: CHECKOUT-SPECIFIC REDIRECT LOGIC
  // Special handling for checkout page - redirect to cart after login
  if (path === "/checkout" && !token) {
    console.log("Unauthenticated user trying to access checkout, redirecting to login");
    
    const loginUrl = new URL("/auth/signin", request.url);
    
    // ✅ CRITICAL: Set callbackUrl to /cart instead of /checkout
    // This ensures user returns to cart page after login where they can proceed to checkout
    loginUrl.searchParams.set("callbackUrl", encodeURI(new URL("/cart", request.url).toString()));
    
    console.log("Redirecting to login with cart return URL");
    return NextResponse.redirect(loginUrl);
  }

  // 🔑 GLOBAL REDIRECT LOGIC for other protected routes
  // If user is not authenticated and trying to access ANY other non-public route
  if (!token) {
    console.log("No token found for protected route, redirecting to login");
    
    const loginUrl = new URL("/auth/signin", request.url);
    
    // ✅ For other protected routes, return to the exact page they were trying to access
    loginUrl.searchParams.set("callbackUrl", encodeURI(request.url));
    
    console.log("Redirecting to login with return URL:", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check token expiration
  if (token.exp && typeof token.exp === "number" && token.exp * 1000 < Date.now()) {
    console.log("Token expired, redirecting to login");
    const url = new URL("/auth/signin", request.url);
    
    // ✅ Handle expired token for checkout differently
    if (path === "/checkout") {
      url.searchParams.set("callbackUrl", encodeURI(new URL("/cart", request.url).toString()));
    } else {
      url.searchParams.set("callbackUrl", encodeURI(request.url)); // Return to original page
    }
    
    url.searchParams.set("error", "TokenExpired");
    return NextResponse.redirect(url);
  }

  // Get user role from token
  const userRole = token.role as string;
  console.log("User role:", userRole);
  console.log("Current path:", path);

  // Role-based access control
  if (path.startsWith("/admin")) {
    if (userRole !== "admin") {
      console.log("Non-admin user trying to access admin route");
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    console.log("Admin access granted");
    return NextResponse.next();
  }

  if (path.startsWith("/vendor") && !path.startsWith("/vendor/onboarding")) {
    if (userRole !== "vendor") {
      console.log("Non-vendor user trying to access vendor route");
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    console.log("Vendor access granted");
    return NextResponse.next();
  }

  // Check against protected routes configuration
  const [matchingRoute, params] = findMatchingRoute(path);
  if (matchingRoute) {
    const allowedRoles = protectedRoutes[matchingRoute];
    if (!allowedRoles.includes(userRole)) {
      console.log("User role not allowed for route");
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  console.log("Access granted to:", path);
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