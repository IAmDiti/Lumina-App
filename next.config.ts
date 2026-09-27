import path from "node:path";
import type { NextConfig } from "next";

const root = path.resolve(__dirname);

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray lockfile higher up the tree isn't picked up.
  outputFileTracingRoot: root,
  turbopack: { root },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Voice Talk needs microphone access from the app itself.
          { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
