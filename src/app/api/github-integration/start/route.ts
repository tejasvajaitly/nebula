export async function GET() {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  let REDIRECT_URI = process.env.GITHUB_OAUTH_REDIRECT;

  if (!GITHUB_CLIENT_ID || !REDIRECT_URI) {
    return new Response(
      "There is some problem with github integration. Please contact support.",
      { status: 400 }
    );
  }

  REDIRECT_URI = encodeURIComponent(REDIRECT_URI);

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=read:user repo`;

  return Response.redirect(githubAuthUrl);
}
