import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("pocha-token")?.value || "";

  if (request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "api/login") {
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.SECRET_KEY));
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/", "/login/:path*", "/task/:path*", "/schedule/:path*"],
};
