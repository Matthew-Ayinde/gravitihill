import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Practice detail pages were folded into /services; keep old links and
  // indexed URLs landing somewhere useful.
  async redirects() {
    return [{ source: "/services/:slug", destination: "/services", permanent: true }];
  },
  // SITE_MODE=review (the client preview deployment): every response carries
  // noindex, which also covers images, PDFs and anything without a <head>.
  async headers() {
    if (process.env.SITE_MODE?.trim().toLowerCase() !== "review") return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
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
