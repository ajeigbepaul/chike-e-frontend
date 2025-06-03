import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return new NextResponse("Token is required", { status: 400 });
    }

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/v1/vendors/verify-invitation?token=${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return new NextResponse(error.message || "Invalid invitation", {
        status: response.status,
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error verifying invitation:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
