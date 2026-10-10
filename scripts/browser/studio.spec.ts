import { test, expect } from "@playwright/test";

test("themes persist and export the active semantic palette", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Mineral Warm/ }).click();
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await page.getByRole("button", { name: "Blue accent" }).click();
  await page.getByLabel("Corner radius").selectOption("soft");
  await page
    .getByRole("combobox", { name: "Density", exact: true })
    .selectOption("comfortable");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "mineral");
  await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
  await expect(
    page.getByRole("button", { name: "Blue accent" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("combobox", { name: "Density", exact: true }),
  ).toHaveValue("comfortable");
  await page.getByRole("button", { name: "Export theme" }).click();
  await page.getByLabel("Export format").selectOption("json");
  const data = JSON.parse(await page.locator(".export-preview").innerText());
  expect(data.settings).toMatchObject({
    theme: "mineral",
    mode: "dark",
    accent: "blue",
    radius: "soft",
    density: "comfortable",
  });
  expect(data.semantic["--accent"]).toBe("#96baff");
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download JSON" }).click();
  expect((await downloaded).suggestedFilename()).toBe(
    "precision-mineral-dark.json",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "Reset theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "graphite");
});

test("workspace search, invitation, keyboard dismissal, and settings work", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Search projects" }).fill("mobile");
  await expect(
    page.getByText("Mobile onboarding", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Website refresh", { exact: true }),
  ).not.toBeVisible();
  await page.getByRole("textbox", { name: "Search projects" }).fill("missing");
  await expect(page.getByText("No projects match “missing”.")).toBeVisible();
  const invite = page.getByRole("button", { name: "Invite member" });
  await invite.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(invite).toBeFocused();
  await invite.click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("teammate@example.com");
  await page.getByRole("button", { name: "Add invitation" }).click();
  await expect(page.getByText("1 invitation sent")).toBeVisible();
  await page.getByRole("tab", { name: "Activity", exact: true }).click();
  await expect(
    page.getByText("Invitation sent to teammate@example.com"),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Settings", exact: true }).click();
  await page.getByRole("switch", { name: "Enable email digest" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Email digest disabled for this preview.",
  );
});

test("mobile fits the viewport and navigation is usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("button", { name: "Components", exact: true }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Components" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Open dialog" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Got it" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});

test("capture desktop and phone theme previews", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/");
  await page.screenshot({
    path: "/private/tmp/precision-desktop.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await page.screenshot({
    path: "/private/tmp/precision-dark.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.getByRole("button", { name: "Reset theme" }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "/private/tmp/precision-mobile.png",
    fullPage: true,
    animations: "disabled",
  });
});

test("all sections fit narrow phones and tablets", async ({ page }) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const name of [
      "Theme studio",
      "Components",
      "Foundations",
      "Agent guide",
    ]) {
      if (width <= 760)
        await page.getByRole("button", { name: "Open navigation" }).click();
      await page.getByRole("button", { name, exact: true }).click();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        `${name} at ${width}px`,
      ).toBeLessThanOrEqual(width);
    }
  }
});
