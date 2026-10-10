import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const tokens = JSON.parse(
  readFileSync(new URL("../src/system/tokens.json", import.meta.url), "utf8"),
);
function luminance(hex) {
  const channels = hex
    .slice(1)
    .match(/../g)
    .map((value) => parseInt(value, 16) / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
const keys = Object.keys(tokens.themes.graphite.light).sort();
for (const [name, theme] of Object.entries(tokens.themes)) {
  test(`${name} has complete light and dark palettes`, () => {
    assert.ok(tokens.accents[theme.accent]);
    for (const mode of ["light", "dark"]) {
      assert.deepEqual(Object.keys(theme[mode]).sort(), keys);
      for (const color of Object.values(theme[mode]))
        assert.match(color, /^#[0-9a-f]{6}$/i);
    }
  });
  for (const mode of ["light", "dark"]) {
    test(`${name} ${mode} meets normal text contrast`, () => {
      const palette = theme[mode];
      for (const foreground of ["text", "muted"])
        for (const background of ["canvas", "surface", "subtle"])
          assert.ok(
            contrast(palette[foreground], palette[background]) >= 4.5,
            `${foreground} on ${background}`,
          );
      for (const state of ["success", "danger"])
        assert.ok(
          contrast(palette[state], palette[`${state}Soft`]) >= 4.5,
          state,
        );
      for (const [name, accent] of Object.entries(tokens.accents)) {
        assert.ok(
          contrast(accent[mode], mode === "light" ? "#ffffff" : "#171922") >=
            4.5,
          `${name} solid action`,
        );
        for (const bg of ["surface", "canvas"])
          assert.ok(
            contrast(accent[mode], palette[bg]) >= 4.5,
            `${name} on ${bg}`,
          );
        assert.ok(
          contrast(
            accent[mode],
            accent[mode === "light" ? "lightSoft" : "darkSoft"],
          ) >= 4.5,
          `${name} badge`,
        );
      }
    });
  }
}
