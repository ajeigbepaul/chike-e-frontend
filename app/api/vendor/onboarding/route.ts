import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, password, phone, address, bio } = await req.json();

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/v1/vendors/onboarding`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          phone,
          address,
          bio,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return new NextResponse(
        error.message || "Failed to complete onboarding",
        {
          status: response.status,
        }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error completing vendor onboarding:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
