// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

const shouldProceed = (pathname: string) => {
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return false;
  }
  return true;
};

export function middleware(request: NextRequest) {
  const { locale, pathname } = request.nextUrl;
  if (!shouldProceed(pathname)) return;
  const nextLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (locale === nextLocale || nextLocale === undefined) return;
  const response = NextResponse.redirect(
    new URL(`/${nextLocale || "en"}${request.nextUrl.pathname}`, request.url),
  );
  return response;
}
