import nextPkg from "next/package.json";

// Baked at build time so the response describes the deployed build, not the request.
export const dynamic = "force-static";

export function GET() {
  return Response.json({
    next: nextPkg.version,
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
    builtAt: new Date().toISOString(),
  });
}
