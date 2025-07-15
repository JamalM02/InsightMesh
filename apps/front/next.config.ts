import type { NextConfig } from "next";

const prodConfig: NextConfig = {
  basePath: "/app",
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/app",
        destination: "/app/",
        permanent: true,
      },
    ];
  },
};

const nextConfig: NextConfig = {};

export default nextConfig;
