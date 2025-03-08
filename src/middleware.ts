import { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isPublicRoute = createRouteMatcher(["/", "/github-integration-error"]);
const isAPIRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // For users visiting /onboarding, don't try to redirect
  if (
    userId &&
    isOnboardingRoute(req) &&
    sessionClaims?.metadata?.onboardingComplete
  ) {
    const dashboardgUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardgUrl);
  }

  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId && isProtectedRoute(req))
    return redirectToSignIn({ returnBackUrl: req.url });

  // If the user isn't signed in and the route is onboarding, redirect to sign-in
  if (!userId && isOnboardingRoute(req))
    return redirectToSignIn({ returnBackUrl: req.url });

  // Catch users who do not have `onboardingComplete: true` in their publicMetadata
  // Redirect them to the /onboading route to complete onboarding
  if (
    userId &&
    !sessionClaims?.metadata?.onboardingComplete &&
    !isAPIRoute(req) &&
    !isPublicRoute(req)
  ) {
    console.log("redirecting to onboarding");
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

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
