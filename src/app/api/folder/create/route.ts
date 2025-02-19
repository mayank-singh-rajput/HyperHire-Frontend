import { NextRequest, NextResponse } from "next/server";

/**
 * Please notice that the error messages will be used for translation. Please don't change them.
 * @param request
 * @returns
 */
export async function POST(request: NextRequest) {
  const { id, name, parentId } = await request.json();
  const user = request.cookies.get("token")?.value;

  try {
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const response = await fetch(`${process.env.BASE_URL}/folders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.AUTHENTICATION_TOKEN}`,
      },
      body: JSON.stringify({ user, id, name, parentId }),
    });

    if (!response.ok) {
      throw new Error("Creation Failed");
    }

    const data = await response.json();    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Creation Failed" }, { status: 500 });
  }
}
