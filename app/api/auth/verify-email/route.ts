import { NextResponse } from "next/server";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=invalid_token", request.url)
      );
    }

    // Call the backend API to verify the email
    const response = await axios.get(`${API_URL}/auth/verify-email/${token}`);

    if (response.data.status === "success") {
      return NextResponse.redirect(
        new URL("/auth/verify-success", request.url)
      );
    } else {
      return NextResponse.redirect(
        new URL("/auth/signin?error=verification_failed", request.url)
      );
    }
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(
      new URL("/auth/signin?error=verification_failed", request.url)
    );
  }
}
