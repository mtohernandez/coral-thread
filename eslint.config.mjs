import { createRequire } from "module";
import prettierConfig from "eslint-config-prettier";

const require = createRequire(import.meta.url);
const nextConfig = require("eslint-config-next/core-web-vitals");

const eslintConfig = Array.isArray(nextConfig) ? nextConfig : [nextConfig];

const config = [...eslintConfig, prettierConfig];
export default config;
