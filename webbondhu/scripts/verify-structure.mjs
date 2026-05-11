import { access } from "node:fs/promises";
const required = ["apps/web", "apps/api", "apps/admin", "packages/ui", "packages/config", "packages/types", "packages/ai", "packages/database", "docker", "nginx", "scripts", "docs", ".github"];
await Promise.all(required.map((path) => access(new URL(`../${path}`, import.meta.url))));
console.log(`Verified ${required.length} top-level WebBondhu workspaces and operations directories.`);
