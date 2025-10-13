import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://server:8080/:path*", // nom du service backend Docker
            },
        ]
    },
};

export default nextConfig;
