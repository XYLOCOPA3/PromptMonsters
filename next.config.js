/** @type {import('next').NextConfig} */

loadEnv(process.env.STAGE);

const withInterceptStdout = require("next-intercept-stdout");
const { i18n } = require("./next-i18next.config");

const nextConfig = withInterceptStdout(
  {
    reactStrictMode: false,
    swcMinify: true,
    i18n,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "ipfs.io",
          port: "",
          pathname: "/**",
        },
      ],
    },
  },
  (text) => (text.includes("Duplicate atom key") ? "" : text),
);

module.exports = nextConfig;

/**
 * @param {string} stage
 */
function loadEnv(stage = "local") {
  const env = {
    ...require(`./env/env.${stage}`),
    NEXT_PUBLIC_APP_ENV: stage,
  };

  Object.entries(env).forEach(([key, value]) => {
    process.env[key] = value;
  });
}
