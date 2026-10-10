import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  realpathSync,
  copyFileSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { build, preview } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { chromium, expect } from "@playwright/test";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
test("packed package supports a production Tailwind v4 consumer", async (t) => {
  const consumer = realpathSync(
    mkdtempSync(join(tmpdir(), "precision-tailwind-")),
  );
  let server, browser;
  try {
    execFileSync(
      "npm",
      ["pack", "--ignore-scripts", "--pack-destination", consumer],
      { cwd: root, stdio: "pipe" },
    );
    const { version } = JSON.parse(
      readFileSync(join(root, "package.json"), "utf8"),
    );
    writeFileSync(
      join(consumer, "package.json"),
      JSON.stringify({
        name: "precision-tailwind-consumer",
        private: true,
        type: "module",
      }),
    );
    execFileSync(
      "npm",
      [
        "install",
        join(consumer, `precision-ui-${version}.tgz`),
        "--ignore-scripts",
        "--offline",
        "--no-audit",
        "--no-fund",
      ],
      { cwd: consumer, stdio: "pipe" },
    );
    for (const file of ["index.html", "App.tsx", "styles.css"])
      copyFileSync(join(root, "scripts/tailwind", file), join(consumer, file));
    // Resolve Tailwind's entry from the test tooling; the consumer only installs the release package.
    const tailwindEntry = fileURLToPath(
      import.meta.resolve("tailwindcss/index.css"),
    );
    const base = {
      configFile: false,
      root: consumer,
      plugins: [tailwindcss()],
      resolve: { alias: { tailwindcss: tailwindEntry } },
      logLevel: "error",
    };
    await build(base);
    server = await preview({
      ...base,
      preview: { host: "127.0.0.1", port: 0 },
    });
    const { port } = server.httpServer.address();
    browser = await chromium.launch({
      headless: true,
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    });
    const page = await browser.newPage({
      viewport: { width: 1000, height: 800 },
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${port}`);
    await expect(page.locator("html")).toHaveAttribute("data-mode", "light");
    await t.test(
      "Preflight preserves defaults and utilities override without important",
      async () => {
        await expect(page.locator("#default")).toHaveCSS(
          "background-color",
          "rgb(96, 82, 204)",
        );
        await expect(page.locator("#default")).toHaveCSS(
          "border-top-width",
          "1px",
        );
        await expect(page.getByRole("textbox")).toHaveCSS(
          "border-top-style",
          "solid",
        );
        await expect(page.locator("#override")).toHaveCSS(
          "padding-left",
          "32px",
        );
        await expect(page.locator("#override")).toHaveCSS(
          "border-radius",
          "0px",
        );
        await expect(page.locator("#override")).toHaveCSS(
          "background-color",
          "rgb(96, 82, 204)",
        );
        await page.locator("#override").hover();
        await expect(page.locator("#override")).toHaveCSS(
          "background-color",
          "rgb(187, 48, 61)",
        );
      },
    );
    await t.test(
      "semantic typography and spacing use Precision tokens",
      async () => {
        await expect(page.locator("#surface")).toHaveCSS(
          "padding-left",
          "16px",
        );
        await expect(page.locator("#surface")).toHaveCSS("font-size", "14px");
        await expect(page.locator("#surface")).toHaveCSS(
          "border-radius",
          "8px",
        );
        await expect(page.locator("#surface")).toHaveCSS(
          "background-color",
          "rgb(255, 255, 255)",
        );
      },
    );
    await t.test(
      "color and dark utilities follow all theme and mode changes",
      async () => {
        for (const setting of [
          {
            label: "Graphite dark",
            mode: "dark",
            bg: "rgb(27, 30, 37)",
            text: "rgb(240, 241, 245)",
          },
          {
            label: "Mineral light",
            mode: "light",
            bg: "rgb(255, 254, 250)",
            text: "rgb(41, 44, 41)",
          },
          {
            label: "Mineral dark",
            mode: "dark",
            bg: "rgb(32, 37, 31)",
            text: "rgb(241, 243, 235)",
          },
          {
            label: "Graphite light",
            mode: "light",
            bg: "rgb(255, 255, 255)",
            text: "rgb(32, 35, 44)",
          },
        ]) {
          await page
            .getByRole("button", { name: setting.label, exact: true })
            .click();
          await expect(page.locator("#surface")).toHaveCSS(
            "background-color",
            setting.bg,
          );
          await expect(page.locator("#surface")).toHaveCSS(
            "color",
            setting.text,
          );
          await expect(page.locator("#dark-variant")).toHaveCSS(
            "opacity",
            setting.mode === "dark" ? "0.5" : "1",
          );
        }
      },
    );
    await t.test(
      "responsive utilities and mobile touch minimums work",
      async () => {
        const button = page.locator("#override");
        assert.ok((await button.boundingBox()).width < 320);
        await page.setViewportSize({ width: 390, height: 844 });
        assert.equal(Math.round((await button.boundingBox()).width), 320);
        await expect(button).toHaveCSS("min-height", "44px");
      },
    );
    await t.test(
      "portaled dialogs retain theme styles and keyboard dismissal",
      async () => {
        await page
          .getByRole("button", { name: "Mineral dark", exact: true })
          .click();
        await page.getByRole("button", { name: "Open themed dialog" }).click();
        await expect(page.getByRole("dialog")).toHaveCSS(
          "background-color",
          "rgb(32, 37, 31)",
        );
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).not.toBeVisible();
      },
    );
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    if (server)
      await new Promise((resolve) => server.httpServer.close(resolve));
    rmSync(consumer, { recursive: true, force: true });
  }
});
