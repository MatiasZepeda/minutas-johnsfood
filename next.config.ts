import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["@prisma/client", "prisma", "@react-pdf/renderer"],
};

export default nextConfig;
