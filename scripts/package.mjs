import { copyFileSync } from "node:fs";
for (const name of ["styles.css", "tokens.json"]) {
  copyFileSync(
    new URL(`../src/system/${name}`, import.meta.url),
    new URL(`../dist-lib/${name}`, import.meta.url),
  );
}
