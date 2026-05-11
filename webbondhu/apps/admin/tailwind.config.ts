import type { Config } from "tailwindcss";
const config: Config = { content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"], theme: { extend: { colors: { background: "#080808", surface: "#111111", line: "#1a1a1a", primary: "#00E5A0", secondary: "#7C3AED" } } }, plugins: [] };
export default config;
