import fs from "node:fs";
import path from "node:path";

const principals = /^(?:export\s+)?(?:abstract\s+)?(?:class|interface|enum|type)\s+/gm;

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name.endsWith(".ts") && entry.name !== "index.ts") {
      const hits = fs.readFileSync(full, "utf8").match(principals) ?? [];
      if (hits.length > 1) {
        console.error(`${full} declares ${hits.length} principals`);
        process.exitCode = 1;
      }
    }
  }
}

walk("src");
if (process.exitCode) process.exit(process.exitCode);
console.log("one principal per source file");
