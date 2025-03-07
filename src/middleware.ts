import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};

export default async function middleware(req: NextRequest) {
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
}
