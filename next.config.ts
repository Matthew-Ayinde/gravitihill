import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Practice detail pages were folded into /services; keep old links and
  // indexed URLs landing somewhere useful.
  async redirects() {
    return [{ source: "/services/:slug", destination: "/services", permanent: true }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
