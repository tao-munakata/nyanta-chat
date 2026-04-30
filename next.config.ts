import type { NextConfig } from "next";

const basePath = process.env.BASE_PATH;

const nextConfig: NextConfig = {
  output: "standalone",
  ...(basePath && basePath !== "/" ? { basePath } : {}),
};

export default nextConfig;
