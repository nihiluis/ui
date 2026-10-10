# Precision

A reusable React + TypeScript design system built on Base UI, with a local theme studio and agent design contract. Restrained, precise, balanced, responsive.

## Run

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. `npm run build` checks types and produces the studio in dist. `npm run preview` serves that build. `npm run test:browser` runs interaction and mobile layout checks against a running dev server (install Chromium with `npx playwright install chromium` first). `npm test` checks the theme palette contract and text contrast across every theme/mode/accent combination.

## Included

- Graphite and Mineral themes, each with light and dark appearance.
- Accent, corner radius, and density customization with device-local persistence.
- Reusable Button, Input, Switch, Checkbox, Badge, Card, Dialog, and Tabs components.
- Responsive SaaS example with project search, activity, preferences, and a local invitation demo.
- Component gallery, token foundations, and agent guide.
- CSS exports for the current theme appearance, JSON exports with all tokens and current settings, and an agent starter prompt.

## Reuse in another application

Install the versioned GitHub release package into each React 19 web app:

```sh
npm install https://github.com/nihiluis/ui/releases/download/v0.0.2/precision-ui-0.0.2.tgz
```

For a private repository, download the asset using an authenticated GitHub session or `gh release download v0.0.2 --repo nihiluis/ui --pattern '*.tgz'`, then install the downloaded tarball. npm does not automatically authenticate private release download URLs. You can also install from GitHub with authenticated git access: `npm install github:nihiluis/ui#v0.0.2`; this builds the package through its prepare script.

```tsx
import { ThemeProvider, Button } from "precision-ui";
import "precision-ui/styles.css";

export default function App() {
  return (
    <ThemeProvider>
      <Button variant="primary">Get started</Button>
    </ThemeProvider>
  );
}
```

Import portable tokens from `precision-ui/tokens.json`. Agent guidance is included at `node_modules/precision-ui/GUI.md`. React and React DOM are peer dependencies so the host application owns its React runtime. Base UI and Lucide are runtime dependencies. Each app installs a pinned release; changes arrive when you explicitly upgrade.

`npm run build:lib` creates the ESM library, TypeScript declarations, CSS, and token JSON in dist-lib. `npm pack` builds an installable tarball. The studio build remains separate in dist. This package is marked private to prevent accidental npm registry publication; GitHub release tarball and git installation work independently of npm publishing.

ThemeProvider sets variables on the document root, including portaled dialogs, and persists settings under precision-theme-v1. It manages one active global theme. Use separate application roots/documents for independently themed apps. For SSR, integrate server-provided initial theme settings before shipping to avoid a flash of the default appearance.

## Tailwind CSS v4

Tailwind support is optional. For apps using Tailwind v4, import this bridge in the app's main CSS, after Tailwind:

```css
@import "tailwindcss";
@import "precision-ui/tailwind.css";
```

Import that app stylesheet once in your entry point and wrap the app in ThemeProvider as above. The bridge includes the component stylesheet in the components cascade layer, so Tailwind utilities override component defaults. Do not also import precision-ui/styles.css; loading it without a layer would override utilities. Use the Tailwind v4 Vite or PostCSS integration to compile the bridge; it is not standalone browser CSS.

```tsx
<Button variant="primary" className="w-full px-6 md:w-auto">
  Create project
</Button>
<div className="bg-surface text-content rounded-precision p-precision-6">
  Shared theme tokens, expressed as utilities.
</div>
```

Semantic color utilities include bg-canvas, bg-surface, bg-subtle, text-content, text-muted, border-border, bg-accent, text-on-accent, and success/danger colors with their soft variants. They follow live theme, accent, and appearance changes. Shared scales expose rounded-precision, shadow-precision, font-precision-sans, font-precision-mono, text-precision-body (plus xs/sm/lg/xl/display), and spacing utilities such as p-precision-4 and gap-precision-2.

The bridge maps dark: variants to ThemeProvider's data-mode="dark" attribute, so manual appearance changes and Tailwind dark utilities stay synchronized. These semantic colors usually remove the need for separate light/dark color classes. It does not import Tailwind itself, change your breakpoints, or require Tailwind for plain CSS consumers. Tailwind v3 has no dedicated adapter in this release.

Run npm run test:tailwind to pack the library and verify a separate Tailwind v4 consumer's production build, computed utility overrides, responsive sizing, theme/mode updates, and dialog styling. It uses Playwright Chromium; install it with npx playwright install chromium if needed.

## Multiple themes

Keep theme variants in the same repo. Share component behavior and semantic token names; customize theme values. Light/dark appearance is independent of theme identity. Add new themes in src/system/tokens.json with matching semantic keys for both appearances and a recommended accent. The studio theme list and TypeScript theme types derive from those definitions.

Customize through the studio or `useTheme().update({ theme: 'mineral', accent: 'teal', mode: 'dark' })`. CSS exports capture one active appearance; JSON exports preserve both themes, all accents, scales, and settings. Exports provide theme data, not a component bundle.

## Agent interoperability

Start by asking an agent to read [GUI.md](GUI.md). It documents component APIs, semantic variables, design principles, responsive behavior, validation, and extension rules. Use the studio's Agent guide to copy a starting prompt. Keep GUI.md current as the public API evolves.

## Mobile and native

The included components support responsive mobile web. Native apps can reuse tokens.json, but Base UI and React DOM cannot run in React Native. Translate the numeric scales and semantic palettes to native styles and build native wrappers separately.

## Foundation references

[Base UI quick start](https://base-ui.com/react/overview/quick-start) and [component documentation](https://base-ui.com/react/components/button). Conceptually inspired by [Graphical](https://www.graphicalui.com/): a shared theme, components, and agent context. No Graphical assets or paid resources are included.
