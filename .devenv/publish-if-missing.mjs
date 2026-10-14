import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const spec = `${pkg.name}@${pkg.version}`;

try {
  execSync(`npm view "${spec}" version`, { stdio: "ignore" });
  console.log(`${spec} is already on npm`);
} catch {
  const provenance = process.env.GITHUB_ACTIONS ? " --provenance" : "";
  execSync(`npm publish --access public${provenance}`, { stdio: "inherit" });
}
