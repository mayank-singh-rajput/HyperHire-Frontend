import { NextRequest, NextResponse } from "next/server";

/**
 * Please notice that the error messages will be used for translation. Please don't change them.
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  const { email, name } = await request.json();

  try {
    const response = await fetch(`${process.env.BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.AUTHENTICATION_TOKEN}`,
      },
      body: JSON.stringify({ email, name }),
    });

    if (!response.ok) {
      throw new Error("Login Failed");
    }

    const data = await response.json();
    const user = data?.id;
    const res = NextResponse.json(data);
    res.cookies.set("token", user, {
      maxAge: Number(process.env.MAX_AGE_SESSION),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: "Login Failed" }, { status: 500 });
  }
}
