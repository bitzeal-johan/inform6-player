import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // App code uses .js extensions in imports (e.g. '../app/games/advent.js')
    // that actually resolve to .ts files. This alias lets webpack find them.
    config.resolve.extensionAlias = {
      ".js": [".js", ".ts", ".tsx"],
    };
    return config;
  },
};

export default nextConfig;
