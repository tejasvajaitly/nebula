import { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isAPIRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isProtectedRoute(req)) await auth.protect();
  if (isOnboardingRoute(req)) await auth.protect();

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  const previewDomain = process.env.NEXT_PUBLIC_PREVIEW_DOMAIN!;
  const url = req.nextUrl;
  const host = req.headers.get("host");
  let subdomain;
  if (host?.endsWith(previewDomain)) {
    const hostSegments = host.split(".");
    if (hostSegments.length === 4) {
      subdomain = hostSegments[0];
      return NextResponse.rewrite(
        new URL(`/${subdomain}${url.pathname}`, req.url)
      );
    } else {
      return NextResponse.next();
    }
  }
  subdomain = host?.replace(`.${rootDomain}`, "");

  if (subdomain !== rootDomain) {
    return NextResponse.rewrite(
      new URL(`/${subdomain}${url.pathname}`, req.url)
    );
  }

  return NextResponse.next();
});
