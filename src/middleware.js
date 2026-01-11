import { NextResponse } from "next/server";
import diagnosticsData from '../src/app/diagnostics/diagnostics.json';
import { decrypt } from "./components/auth-utils";

export async function insurement(diagnosticId) {
  return diagnosticsData
    .flatMap(group => group.items)
    .find(item => item.id === diagnosticId);
} 

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const protectHistory = pathname.startsWith("/history");
  const protectDiagnosticsChildren = pathname.startsWith("/diagnostics/") && pathname !== "/diagnostics";
  const isProtected = protectHistory || protectDiagnosticsChildren;

  if (!isProtected) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get("session")?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/404", req.url));
  }

  const session = await decrypt(sessionCookie);

  if (!session?.doctor?.id) {
    return NextResponse.redirect(new URL("/404", req.url));
  }

  if(pathname.startsWith("/diagnostics/")) {
    const diagnosticId = pathname.split("/")[2];
    const diagnostic = await insurement(diagnosticId);
    if (!diagnostic) {
      const url = req.nextUrl.clone();
      url.pathname = "/404";
      return NextResponse.redirect(url);
    }

  }

  return NextResponse.next();
}
