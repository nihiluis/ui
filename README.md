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
npm install https://github.com/nihiluis/ui/releases/download/v0.0.1/precision-ui-0.0.1.tgz
```

For a private repository, download the asset using an authenticated GitHub session or `gh release download v0.0.1 --repo nihiluis/ui --pattern '*.tgz'`, then install the downloaded tarball. npm does not automatically authenticate private release download URLs. You can also install from GitHub with authenticated git access: `npm install github:nihiluis/ui#v0.0.1`; this builds the package through its prepare script.

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

## Multiple themes

Keep theme variants in the same repo. Share component behavior and semantic token names; customize theme values. Light/dark appearance is independent of theme identity. Add new themes in src/system/tokens.json with matching semantic keys for both appearances and a recommended accent. The studio theme list and TypeScript theme types derive from those definitions.

Customize through the studio or `useTheme().update({ theme: 'mineral', accent: 'teal', mode: 'dark' })`. CSS exports capture one active appearance; JSON exports preserve both themes, all accents, scales, and settings. Exports provide theme data, not a component bundle.

## Agent interoperability

Start by asking an agent to read [GUI.md](GUI.md). It documents component APIs, semantic variables, design principles, responsive behavior, validation, and extension rules. Use the studio's Agent guide to copy a starting prompt. Keep GUI.md current as the public API evolves.

## Mobile and native

The included components support responsive mobile web. Native apps can reuse tokens.json, but Base UI and React DOM cannot run in React Native. Translate the numeric scales and semantic palettes to native styles and build native wrappers separately.

## Foundation references

[Base UI quick start](https://base-ui.com/react/overview/quick-start) and [component documentation](https://base-ui.com/react/components/button). Conceptually inspired by [Graphical](https://www.graphicalui.com/): a shared theme, components, and agent context. No Graphical assets or paid resources are included.
