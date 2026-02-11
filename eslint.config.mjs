import { createRequire } from "module";

const require = createRequire(import.meta.url);
const nextConfig = require("eslint-config-next/core-web-vitals");

const eslintConfig = Array.isArray(nextConfig) ? nextConfig : [nextConfig];

export default eslintConfig;
