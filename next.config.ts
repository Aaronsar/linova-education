import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/2025/09/17/bts-biologie-medicale-paris-linova-education",
        destination: "/formations/bts-biologie-medicale",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
