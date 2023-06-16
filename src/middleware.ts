import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const maintenance = process.env.MAINTENANCE === "true";
  console.log(process.env.MAINTENANCE);
  console.log(`request.nextUrl.pathname: ${request.nextUrl.pathname}`);
  if (maintenance) {
    if (request.nextUrl.pathname === "/maintenance") return;
    // if (isApiPath(request.nextUrl.pathname))
    //   return NextResponse.rewrite(new URL("/api/maintenance", request.url));
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }
  if (request.nextUrl.pathname === "/maintenance")
    return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - assets
     * - locales
     */
    // "/((?!_next/static|_next/image|assets|locales).*)",
    "/((?!api|_next/static|_next/image|assets|locales).*)",
    "/",
  ],
};

// "/api" から始まる文字列かチェックする関数
function isApiPath(path: string): boolean {
  return path.startsWith("/api");
}
