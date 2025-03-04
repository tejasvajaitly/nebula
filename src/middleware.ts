import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};

export default async function middleware(req: NextRequest) {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  const previewDomain = process.env.NEXT_PUBLIC_PREVIEW_DOMAIN;
  const url = req.nextUrl;
  const host = req.headers.get("host");
  let subdomain = host?.replace(`.${previewDomain}`, "");
  subdomain = host?.replace(`.${rootDomain}`, "");

  if (subdomain !== rootDomain && subdomain !== previewDomain) {
    return NextResponse.rewrite(
      new URL(`/${subdomain}${url.pathname}`, req.url)
    );
  }

  return NextResponse.next();
}
