import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { email, password } = body;

  if (email === "drsmith@example.com" && password === "alskdj1092#") {
    return NextResponse.json({
      refresh: "jwt-refresh-token-mock",
      access: "jwt-access-token-mock",
      doctor: {
        id: 12,
        name: "Dr. Smith",
        username: "drsmith",
        email: "drsmith@example.com",
        credits: 100,
        account_status: "ACTIVE",
        profile_picture: null,
        created_at: "2025-12-18T10:15:30Z",
      },
    });
  }

  return NextResponse.json(
    { message: "email or password is invalid" },
    { status: 401 }
  );
}
