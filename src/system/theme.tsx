import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import tokens from "./tokens.json";
export { tokens };
export type ThemeSettings = {
  theme: keyof typeof tokens.themes;
  mode: "light" | "dark";
  accent: keyof typeof tokens.accents;
  radius: keyof typeof tokens.radius;
  density: keyof typeof tokens.density;
};
export const defaultSettings: ThemeSettings = {
  theme: "graphite",
  mode: "light",
  accent: "iris",
  radius: "balanced",
  density: "balanced",
};
export function isThemeSettings(value: unknown): value is ThemeSettings {
  if (!value || typeof value !== "object") return false;
  const s = value as ThemeSettings;
  return (
    Object.hasOwn(tokens.themes, s.theme) &&
    ["light", "dark"].includes(s.mode) &&
    Object.hasOwn(tokens.accents, s.accent) &&
    Object.hasOwn(tokens.radius, s.radius) &&
    Object.hasOwn(tokens.density, s.density)
  );
}
export function themeVariables(
  settings: ThemeSettings,
): Record<string, string> {
  const palette = tokens.themes[settings.theme][settings.mode];
  const accent = tokens.accents[settings.accent];
  return {
    ...Object.fromEntries(
      Object.entries(palette).map(([key, value]) => [
        `--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`,
        value,
      ]),
    ),
    "--accent": accent[settings.mode],
    "--accent-soft":
      accent[settings.mode === "light" ? "lightSoft" : "darkSoft"],
    "--on-accent": settings.mode === "light" ? "#ffffff" : "#171922",
    "--radius": `${tokens.radius[settings.radius]}px`,
    "--control-height": `${tokens.density[settings.density]}px`,
    "--font-sans": tokens.type.sans,
    "--font-mono": tokens.type.mono,
    ...Object.fromEntries(
      Object.entries(tokens.space).map(([key, value]) => [
        `--space-${key}`,
        `${value}px`,
      ]),
    ),
    ...Object.fromEntries(
      Object.entries(tokens.type)
        .filter(([, v]) => typeof v === "number")
        .map(([key, value]) => [`--text-${key}`, `${value}px`]),
    ),
    "--motion-fast": `${tokens.motion.fast}ms`,
    "--motion-normal": `${tokens.motion.normal}ms`,
    "--shadow":
      settings.mode === "light"
        ? "0 8px 32px #20232c12"
        : "0 8px 32px #00000045",
  };
}
export function exportTheme(settings: ThemeSettings) {
  return {
    name: "Precision",
    version: 1,
    settings,
    semantic: themeVariables(settings),
    tokens,
  };
}
export function exportCSS(settings: ThemeSettings) {
  return `/* Precision: ${settings.theme} / ${settings.mode} */\n:root {\n  color-scheme: ${settings.mode};\n${Object.entries(
    themeVariables(settings),
  )
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n")}\n}\n`;
}
const ThemeContext = createContext<{
  settings: ThemeSettings;
  update: (patch: Partial<ThemeSettings>) => void;
  reset: () => void;
} | null>(null);
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem("precision-theme-v1") || "null",
      );
      return isThemeSettings(saved) ? saved : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });
  useEffect(() => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(themeVariables(settings)))
      root.style.setProperty(key, value);
    root.style.colorScheme = settings.mode;
    root.dataset.theme = settings.theme;
    root.dataset.mode = settings.mode;
    try {
      localStorage.setItem("precision-theme-v1", JSON.stringify(settings));
    } catch {
      /* Storage is optional. */
    }
  }, [settings]);
  return (
    <ThemeContext.Provider
      value={{
        settings,
        update: (patch) => setSettings((s) => ({ ...s, ...patch })),
        reset: () => setSettings(defaultSettings),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme requires ThemeProvider");
  return context;
}
