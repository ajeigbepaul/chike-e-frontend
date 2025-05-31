import NextAuth from "next-auth";
import { authOptions } from "../auth.config";

// Create a simple handler for the route
const handler = NextAuth(authOptions);

// Export the handler's GET and POST methods for the route handler
export { handler as GET, handler as POST };
