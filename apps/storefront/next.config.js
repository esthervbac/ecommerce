const isGitHubPages =
  process.env.GITHUB_ACTIONS ||
  (process.env.NODE_ENV === "production" && process.env.VERCEL !== "1");

const nextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
