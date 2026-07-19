import { defineConfig } from "tsup";
import path from "node:path";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: false,
  clean: true,
  tsconfig: "./tsconfig.json",
  external: [
    "react",
    "react-dom",
    "framer-motion",
    "next-themes",
    "lucide-react",
    "@base-ui/react",
    "@base-ui/react/button",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
  ],
  esbuildOptions(options) {
    options.alias = {
      "next/image": path.resolve(__dirname, "shims/next-image.tsx"),
      "next/link": path.resolve(__dirname, "shims/next-link.tsx"),
    };
  },
});
