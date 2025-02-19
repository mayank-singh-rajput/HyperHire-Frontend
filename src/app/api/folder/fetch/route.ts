import { NextRequest, NextResponse } from "next/server";

/**
 * Please notice that the error messages will be used for translation. Please don't change them.
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  const user = request.cookies.get("token")?.value;

  try {
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const response = await fetch(
      `${process.env.BASE_URL}/folders?user=${encodeURIComponent(user)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.AUTHENTICATION_TOKEN}`,
        },
      }
    );

    const data = await response.json() || [];
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Fetch Failed" }, { status: 500 });
  }
}
