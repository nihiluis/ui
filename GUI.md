# Precision UI — agent design contract

Read this file before building or changing interfaces in this repo.

## Intent

A reusable, restrained, precise design system for SaaS and responsive mobile web applications. Balanced density. Clear hierarchy. Use decoration only when it communicates something useful. Theme customization and agent interoperability are first-class concerns.

## Architecture

- `src/system/tokens.json`: portable source of truth. Graphite (cool) and Mineral (warm) themes, each with independent light and dark values. Shared spacing, typography, motion, density, and radius scales.
- `src/system/theme.tsx`: settings validation, semantic CSS variable resolution, ThemeProvider, local persistence, JSON and CSS exports.
- `src/system/components.tsx`: styled wrappers around Base UI. React DOM only.
- `src/system/styles.css`: component and global styles. Independent of the studio.
- `src/system/index.ts`: public exports.
- `src/studio/`: demonstration application, not part of the reusable system.

## Use the public API

```tsx
import {
  ThemeProvider,
  Button,
  Input,
  Card,
  Badge,
  Switch,
  Checkbox,
  Dialog,
  Tabs,
} from "./system";
import "./system/styles.css";

<ThemeProvider>
  <YourApplication />
</ThemeProvider>;
```

Button: `variant="primary" | "secondary" | "ghost" | "danger"`, defaults to secondary. Accepts Base UI Button props. Prefer one primary action per section.
Input: accepts Base UI Input props. Always give it a visible label or accessible name; connect helper/error text with aria-describedby.
Card: children and optional className. Use for meaningful groups, not every small piece of information.
Badge: `tone="neutral" | "accent" | "success" | "danger"`. Include text, so color is not the only signal.
Switch and Checkbox: require a label string; forward Base UI Root props, including checked, onCheckedChange, and disabled.
Dialog: controlled open/onOpenChange, title, description, and children. The title and description are connected by Base UI. Keep focusable actions inside the popup.
Tabs: items `{ value, label, content }[]`, controlled value/onValueChange, and a required accessible label.
Theme: `useTheme()` supplies settings, update(patch), and reset(). Theme and mode are independent. When selecting a theme, use its recommended accent unless intentionally preserving a custom accent.

## Tokens

Use semantic variables, never hex values in reusable components:

- `--canvas`: app background; `--surface`: panels; `--subtle`: low emphasis fills.
- `--text`: primary content; `--muted`: secondary content; `--border`: dividers and control outlines.
- `--accent`, `--accent-soft`, `--on-accent`: brand action, soft fill, and content on solid accent.
- `--success`, `--success-soft`, `--danger`, `--danger-soft`: feedback.
- `--radius`, `--control-height`, `--shadow`, `--font-sans`, `--font-mono`.
- `--space-{1,2,3,4,5,6,8,10,12,16}` and `--text-{xs,sm,base,lg,xl,display}`.
- `--motion-fast` and `--motion-normal`.

Literal colors are acceptable only inside tokens, theme previews, and color swatches. The demo's illustrative charts use the active accent. Use the shared 4px spacing scale. System fonts are the default; Inter is used only if installed by the consuming app. Keep line heights between 1.4 and 1.8 for body text.

## Themes

Theme identity and light/dark appearance are separate axes. Add a theme by defining the same semantic palette keys for both modes in tokens.json, plus label, description, and recommended accent. TypeScript derives valid theme names automatically. For new accents, include light/dark and lightSoft/darkSoft and check text contrast. Avoid duplicating components per theme.

## Accessibility and mobile

- Preserve Base UI semantics, keyboard navigation, focus trapping, and Escape behavior.
- Visible focus ring, accessible names, labels, and useful error messages are required.
- Normal text must have at least 4.5:1 contrast. Do not communicate status through color alone.
- Use 44px touch targets on small screens and coarse pointers; density never overrides touch usability.
- Avoid horizontal page overflow. Tables may scroll inside a labeled section.
- Respect prefers-reduced-motion. No essential information conveyed through animation.
- Test light/dark and both themes at desktop and narrow phone widths, keyboard-only interactions, dialog focus, and form validation.

## Native applications

React/Base UI components use DOM primitives and are not React Native components. Reuse tokens.json or a JSON export, then map semantic colors, numeric spacing/radius, and motion values to native components. Font stacks and CSS variables require platform-specific translation. Native controls need their own semantics, touch behavior, and accessibility review.

## Scope and validation

Keep product state, data fetching, and domain logic outside src/system. Extend the API deliberately and update this file when it changes. These initial components form a starter, not a comprehensive library. No backend is included in the studio. Preview invitations are local state only.
Run `npm run build` and `npm test`. Add meaningful behavior tests for complex new controls; do not test static implementation details. Review desktop/mobile UI after styling changes.

## Package consumption

Release 0.0.1 exposes precision-ui, precision-ui/styles.css, precision-ui/tokens.json, and precision-ui/GUI.md. Inside this repository use src/system; in consuming apps use those package imports. React 19 and React DOM 19 are peer dependencies. Use npm run build:lib and npm pack when changing the release package. The GitHub tarball includes compiled ESM and declarations; the studio is excluded.
