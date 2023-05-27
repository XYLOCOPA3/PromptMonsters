/** @type {import('next').NextConfig} */

const withInterceptStdout = require("next-intercept-stdout");
const { i18n } = require("./next-i18next.config");

const nextConfig = withInterceptStdout(
  {
    reactStrictMode: false,
    swcMinify: true,
    i18n,
  },
  (text) => (text.includes("Duplicate atom key") ? "" : text),
);

module.exports = nextConfig;
