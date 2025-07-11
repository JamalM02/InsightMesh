import type { NextConfig } from "next";

const prodConfig = {
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

const nextConfig: NextConfig =
  process.env.NODE_ENV === "production" ? prodConfig : {};

export default nextConfig;
