const packageJson = require("../package.json");

/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    APP_VERSION: packageJson.version,
  },
  output: "export",
  distDir: process.env.NODE_ENV === "production" ? "../app" : ".next",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ["../main/shared"],
  webpack: (config) => {
    return config;
  },
};
