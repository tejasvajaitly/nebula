// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export const config = {
//   matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
// };

// const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

// export default clerkMiddleware(async (auth, req) => {
//   if (isProtectedRoute(req)) await auth.protect();

//   const hostname = req.headers.get("host");

//   let subDomain;

//   if (process.env.NODE_ENV === "production") {
//     subDomain = hostname?.replace(
//       `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
//       ""
//     );
//   } else {
//     subDomain = hostname?.replace(`.localhost:3000`, "");
//   }

//   console.log("subDomain", subDomain);

//   if (
//     subDomain === "localhost:3000" ||
//     subDomain === process.env.NEXT_PUBLIC_ROOT_DOMAIN
//   ) {
//     return NextResponse.next();
//   }

//   const url = req.nextUrl;
//   const searchParams = req.nextUrl.searchParams.toString();
//   const path = `${url.pathname}${
//     searchParams.length > 0 ? `?${searchParams}` : ""
//   }`;

//   return NextResponse.rewrite(
//     new URL(`/changelog/${subDomain}${path}`, req.url)
//   );
// });

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// import { readSiteDomain } from "./utils/actions/sites/read-site-domain";

// Define the routes that require authentication
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isAPIRoute = createRouteMatcher(["/api(.*)"]);

// Main middleware function
export default clerkMiddleware(async (auth, req) => {
  // Check if the route is protected and enforce authentication if it is
  if (isProtectedRoute(req)) await auth.protect();
  if (isOnboardingRoute(req)) await auth.protect();

  const { userId, sessionClaims } = await auth();

  if (userId && isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  const url = req.nextUrl;
  const pathname = url.pathname;

  // Get hostname (e.g., 'mike.com', 'test.mike.com')
  const hostname = req.headers.get("host");

  let currentHost;
  if (process.env.NODE_ENV === "production") {
    // In production, use the custom base domain from environment variables
    const baseDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    currentHost = hostname?.replace(`.${baseDomain}`, "");
  } else {
    // In development, handle localhost case
    currentHost = hostname?.replace(`.localhost:3000`, "");
  }

  if (
    userId &&
    !sessionClaims?.metadata?.onboardingComplete &&
    !isAPIRoute(req) &&
    (currentHost === "localhost:3000" ||
      currentHost === process.env.NEXT_PUBLIC_ROOT_DOMAIN)
  ) {
    console.log("redirecting to onboarding");
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  if (
    currentHost === "localhost:3000" ||
    currentHost === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.next();
  }

  // If there's no currentHost, likely accessing the root domain, handle accordingly
  if (!currentHost) {
    // Continue to the next middleware or serve the root content
    return NextResponse.next();
  }

  // Fetch tenant-specific data based on the subdomain
  // const response = await readSiteDomain(currentHost);

  // Handle the case where no subdomain data is found
  // if (!response || !response.length) {
  //   // Continue to the next middleware or serve the root content
  //   return NextResponse.next();
  // }

  // const site_id = response?.[0]?.site_id;
  // Get the tenant's subdomain from the response
  // const tenantSubdomain = response[0]?.site_subdomain;

  // if (tenantSubdomain) {
  //   return NextResponse.rewrite(new URL(`/${site_id}${pathname}`, req.url));
  // }

  // Rewrite the URL to the tenant-specific path
  // return NextResponse.rewrite(
  //   new URL(tenantSubdomain === "/" ? "" : `tsafi.xyz`, req.url)
  // );

  return NextResponse.rewrite(new URL(`/${currentHost}${pathname}`, req.url));
});

// Define which paths the middleware should run for
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
