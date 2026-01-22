import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return {
            beforeFiles: [],
            afterFiles: [],
            fallback: [
                { source: "/api/external/:path*", destination: "http://server:8080/:path*" },
            ],
        };
    },
};

export default nextConfig;
