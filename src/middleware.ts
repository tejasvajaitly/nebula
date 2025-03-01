import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();

  const hostname = req.headers.get("host");

  let subDomain;

  if (process.env.NODE_ENV === "production") {
    subDomain = hostname?.replace(
      `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      ""
    );
  } else {
    subDomain = hostname?.replace(`.localhost:3000`, "");
  }

  console.log("subDomain", subDomain);

  if (
    subDomain === "localhost:3000" ||
    subDomain === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.next();
  }

  const url = req.nextUrl;
  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  return NextResponse.rewrite(
    new URL(`/changelog/${subDomain}${path}`, req.url)
  );
});
