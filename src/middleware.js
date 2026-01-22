import { NextResponse } from "next/server";
import diagnosticsData from '../src/app/(main)/diagnostics/diagnostics.json';
import { decrypt } from "./components/auth-utils";

export async function insurement(diagnosticId) {
  return diagnosticsData
    .flatMap(group => group.items)
    .find(item => item.id === diagnosticId);
} 

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const protectHistory = pathname.startsWith("/history");
  const protectBills = pathname.startsWith("/bills");
  const protectedit = pathname.startsWith("/edit");
  const protectDiagnosticsChildren = pathname.startsWith("/diagnostics/") && pathname !== "/diagnostics";
  const isReportPath = pathname.startsWith("/report");
  const segments = pathname.split("/").filter(Boolean);
  const isProtected = protectHistory || protectDiagnosticsChildren || protectBills || protectedit || isReportPath;

  if (!isProtected) {
    return NextResponse.next();
  }

  if (isReportPath) {
    if (segments.length < 3) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  const sessionCookie = req.cookies.get("session")?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const session = await decrypt(sessionCookie);

  if (!session?.doctor?.id) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if(pathname.startsWith("/diagnostics/")) {
    const diagnosticId = pathname.split("/")[2];
    const diagnostic = await insurement(diagnosticId);
    if (!diagnostic) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
