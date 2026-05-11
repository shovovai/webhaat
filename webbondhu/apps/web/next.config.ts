import type { NextConfig } from "next";
const nextConfig: NextConfig = { reactStrictMode: true, transpilePackages: ["@webbondhu/ui", "@webbondhu/types", "@webbondhu/config"], experimental: { typedRoutes: true } };
export default nextConfig;
