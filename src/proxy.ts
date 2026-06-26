import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const path = request.nextUrl.pathname;

  if (path.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session?.user) {
    const role = session.user.role;

    if (path.startsWith("/dashboard/user") && role !== "USER") {
      return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
    }

    if (path.startsWith("/dashboard/seller") && role !== "SELLER") {
      return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
    }

    if (path.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/dashboard/${role.toLowerCase()}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
