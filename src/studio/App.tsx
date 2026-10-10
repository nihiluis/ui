import { useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  ArrowRight,
  Boxes,
  Check,
  ChevronRight,
  Code2,
  Copy,
  Layers3,
  LayoutDashboard,
  Menu,
  Moon,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Users,
  X,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Dialog,
  Input,
  Switch,
  Tabs,
  exportCSS,
  exportTheme,
  tokens,
  useTheme,
  type ThemeSettings,
} from "../system";
const navigation = [
  { label: "Theme studio", icon: SlidersHorizontal },
  { label: "Components", icon: Boxes },
  { label: "Foundations", icon: Layers3 },
  { label: "Agent guide", icon: Code2 },
];
const agentText = `Read GUI.md before creating or editing interface code. Import components from src/system and use semantic CSS variables from src/system/tokens.json via ThemeProvider. Support both themes and modes; do not hardcode colors in components. Preserve Base UI keyboard behavior, focus management, and reduced-motion support. Validate at mobile and desktop widths. Run npm run build and npm test. Native apps should map the portable token values to native primitives; React DOM components cannot run in React Native.`;
function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function SectionHeading({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{number}</span>
      <h3>{title}</h3>
      {children}
    </div>
  );
}
function Inspector() {
  const { settings, update, reset } = useTheme();
  return (
    <aside className="inspector" aria-label="Theme customization">
      <div className="inspector-title">
        <div>
          <span className="eyebrow">YOUR DESIGN LANGUAGE</span>
          <h2>Make it yours.</h2>
        </div>
        <Button
          variant="ghost"
          className="icon-button"
          aria-label="Reset theme"
          onClick={reset}
        >
          <RotateCcw size={16} />
        </Button>
      </div>
      <section className="inspector-section">
        <SectionHeading number="01" title="Theme" />
        <div className="theme-options">
          {Object.entries(tokens.themes).map(([key, theme]) => (
            <button
              key={key}
              className={`theme-option ${settings.theme === key ? "selected" : ""}`}
              aria-pressed={settings.theme === key}
              onClick={() =>
                update({
                  theme: key as ThemeSettings["theme"],
                  accent: theme.accent as ThemeSettings["accent"],
                })
              }
            >
              <span className={`theme-mini theme-mini-${key}`}>
                <i />
                <i />
                <i />
              </span>
              <span>
                <strong>{theme.label}</strong>
                <small>
                  {key === "graphite" ? "Cool & considered" : "Warm & grounded"}
                </small>
              </span>
              {settings.theme === key && <Check size={15} />}
            </button>
          ))}
        </div>
      </section>
      <section className="inspector-section">
        <SectionHeading number="02" title="Appearance" />
        <div className="segmented">
          {(["light", "dark"] as const).map((mode) => (
            <button
              key={mode}
              aria-pressed={settings.mode === mode}
              className={settings.mode === mode ? "active" : ""}
              onClick={() => update({ mode })}
            >
              {mode === "light" ? <Sun size={15} /> : <Moon size={15} />}{" "}
              {mode === "light" ? "Light" : "Dark"}
            </button>
          ))}
        </div>
        <p className="control-note">One language. Both sides of the day.</p>
      </section>
      <section className="inspector-section">
        <SectionHeading number="03" title="Accent">
          <span className="value-label">
            {tokens.accents[settings.accent].label}
          </span>
        </SectionHeading>
        <div className="swatches">
          {Object.entries(tokens.accents).map(([key, accent]) => (
            <button
              key={key}
              className={`swatch ${settings.accent === key ? "selected" : ""}`}
              aria-label={`${accent.label} accent`}
              aria-pressed={settings.accent === key}
              style={
                { "--swatch": accent[settings.mode] } as React.CSSProperties
              }
              onClick={() => update({ accent: key as ThemeSettings["accent"] })}
            >
              <span />
              {settings.accent === key && <Check size={15} />}
            </button>
          ))}
        </div>
      </section>
      <section className="inspector-section">
        <SectionHeading number="04" title="Shape & spacing" />
        <label className="select-label">
          Corner radius
          <select
            value={settings.radius}
            onChange={(e) =>
              update({ radius: e.target.value as ThemeSettings["radius"] })
            }
          >
            {Object.entries(tokens.radius).map(([key, value]) => (
              <option key={key} value={key}>
                {key[0].toUpperCase() + key.slice(1)} · {value}px
              </option>
            ))}
          </select>
        </label>
        <label className="select-label">
          Density
          <select
            value={settings.density}
            onChange={(e) =>
              update({ density: e.target.value as ThemeSettings["density"] })
            }
          >
            {Object.keys(tokens.density).map((key) => (
              <option key={key} value={key}>
                {key[0].toUpperCase() + key.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <p className="control-note">
          Touch controls keep a 44px minimum on mobile.
        </p>
      </section>
      <div className="inspector-foot">
        <span className="status-dot" />
        <span>Changes saved on this device</span>
      </div>
    </aside>
  );
}
const initialActivity = [
  "Project Atlas moved to in progress",
  "Maya Chen updated the product brief",
  "A new workspace was created",
];
function Workspace() {
  const [tab, setTab] = useState("overview");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [invited, setInvited] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState(true);
  const projects = [
    {
      name: "Website refresh",
      detail: "Brand & experience",
      initials: "WR",
      status: "In progress",
      progress: 72,
      people: "MC",
    },
    {
      name: "Mobile onboarding",
      detail: "Product design",
      initials: "MO",
      status: "In review",
      progress: 90,
      people: "JL",
    },
    {
      name: "Customer insights",
      detail: "Research & strategy",
      initials: "CI",
      status: "Planning",
      progress: 24,
      people: "AK",
    },
  ];
  function invite(e: FormEvent) {
    e.preventDefault();
    setInvited((v) => [...v, email]);
    setEmail("");
    setInviteOpen(false);
  }
  return (
    <div className="workspace">
      <div className="workspace-header">
        <div className="workspace-brand">
          <span className="workspace-symbol">
            <Layers3 size={19} />
          </span>
          <strong>Acme workspace</strong>
          <Badge>Pro</Badge>
        </div>
        <span className="avatar">JD</span>
      </div>
      <div className="workspace-body">
        <div className="workspace-intro">
          <div>
            <span className="eyebrow">MONDAY, OCTOBER 12</span>
            <h2>A little clarity. A lot of progress.</h2>
            <p className="muted">Here’s what’s happening across your team.</p>
          </div>
          <Button variant="primary" onClick={() => setInviteOpen(true)}>
            <Plus size={16} /> Invite member
          </Button>
        </div>
        <Tabs
          value={tab}
          onValueChange={setTab}
          label="Workspace sections"
          items={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <>
                  <div className="metrics">
                    {[
                      {
                        label: "Active projects",
                        value: "12",
                        change: "+2 this month",
                        bars: [25, 35, 30, 45, 40, 55, 60, 50, 70, 65, 85, 90],
                      },
                      {
                        label: "Tasks completed",
                        value: "148",
                        change: "+18% this month",
                        bars: [20, 30, 45, 30, 55, 45, 65, 60, 55, 80, 70, 95],
                      },
                      {
                        label: "Team members",
                        value: String(8 + invited.length),
                        change: invited.length
                          ? `${invited.length} invitation${invited.length > 1 ? "s" : ""} sent`
                          : "Across 3 teams",
                        bars: [],
                      },
                    ].map((metric) => (
                      <Card key={metric.label} className="metric">
                        <span className="muted">{metric.label}</span>
                        <div className="metric-middle">
                          <strong>{metric.value}</strong>
                          {metric.bars.length ? (
                            <div className="spark-bars" aria-hidden="true">
                              {metric.bars.map((height, i) => (
                                <i key={i} style={{ height: `${height}%` }} />
                              ))}
                            </div>
                          ) : (
                            <div className="avatar-stack">
                              {["MC", "JL", "AK"].map((p, i) => (
                                <span className={`avatar avatar-${i}`} key={p}>
                                  {p}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <small
                          className={metric.bars.length ? "positive" : "muted"}
                        >
                          {metric.bars.length ? "↗ " : ""}
                          {metric.change}
                        </small>
                      </Card>
                    ))}
                  </div>
                  <Card className="projects-card">
                    <div className="projects-heading">
                      <h3>
                        Projects <span className="count">3</span>
                      </h3>
                      <label className="search-field">
                        <Search size={15} />
                        <Input
                          aria-label="Search projects"
                          placeholder="Find a project…"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />
                      </label>
                    </div>
                    <div
                      className="table-scroll"
                      role="region"
                      aria-label="Projects table"
                      tabIndex={0}
                    >
                      <table>
                        <thead>
                          <tr>
                            <th>Project name</th>
                            <th>Status</th>
                            <th>Progress</th>
                            <th>Lead</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects
                            .filter((p) =>
                              p.name
                                .toLowerCase()
                                .includes(query.toLowerCase()),
                            )
                            .map((p) => (
                              <tr key={p.name}>
                                <td>
                                  <div className="project-name">
                                    <span className="project-icon">
                                      {p.initials}
                                    </span>
                                    <span>
                                      <strong>{p.name}</strong>
                                      <small>{p.detail}</small>
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <Badge
                                    tone={
                                      p.status === "In progress"
                                        ? "accent"
                                        : p.status === "In review"
                                          ? "success"
                                          : "neutral"
                                    }
                                  >
                                    <span className="badge-dot" />
                                    {p.status}
                                  </Badge>
                                </td>
                                <td>
                                  <div className="progress-cell">
                                    <div
                                      className="progress-track"
                                      role="progressbar"
                                      aria-label={`${p.name} completion`}
                                      aria-valuenow={p.progress}
                                      aria-valuemin={0}
                                      aria-valuemax={100}
                                    >
                                      <span
                                        style={{ width: `${p.progress}%` }}
                                      />
                                    </div>
                                    <small>{p.progress}%</small>
                                  </div>
                                </td>
                                <td>
                                  <span className="avatar avatar-small">
                                    {p.people}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      {!projects.some((p) =>
                        p.name.toLowerCase().includes(query.toLowerCase()),
                      ) && (
                        <p className="empty-state">
                          No projects match “{query}”.
                        </p>
                      )}
                    </div>
                    <div className="table-footer">
                      <span>Good work takes a clear view.</span>
                      <Button
                        variant="ghost"
                        onClick={() => setTab("activity")}
                      >
                        View activity <ArrowRight size={14} />
                      </Button>
                    </div>
                  </Card>
                  <div className="workspace-bottom">
                    <span>
                      <span className="status-dot" /> All systems operational
                    </span>
                    <span>Built for the way you work.</span>
                  </div>
                </>
              ),
            },
            {
              value: "activity",
              label: "Activity",
              content: (
                <Card className="activity-card">
                  <h3>Recent activity</h3>
                  {[
                    ...invited.map((e) => `Invitation sent to ${e}`),
                    ...initialActivity,
                  ].map((item, i) => (
                    <div className="activity-row" key={`${item}-${i}`}>
                      <span className="activity-icon">
                        <Check size={15} />
                      </span>
                      <div>
                        <strong>{item}</strong>
                        <small>
                          {i === 0 && invited.length
                            ? "Just now"
                            : `${i + 1} hours ago`}
                        </small>
                      </div>
                    </div>
                  ))}
                </Card>
              ),
            },
            {
              value: "settings",
              label: "Settings",
              content: (
                <Card className="settings-card">
                  <h3>Workspace preferences</h3>
                  <div className="setting-row">
                    <div>
                      <strong>Email notifications</strong>
                      <p className="muted">
                        Receive a digest of project updates.
                      </p>
                    </div>
                    <Switch
                      label="Enable email digest"
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                  <p className="control-note" role="status">
                    Email digest {notifications ? "enabled" : "disabled"} for
                    this preview.
                  </p>
                </Card>
              ),
            },
          ]}
        />
      </div>
      <Dialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        title="Invite a teammate"
        description="Send a preview invitation to your workspace. No email will be sent."
      >
        <form onSubmit={invite} className="dialog-form">
          <label>
            Email address
            <Input
              type="email"
              required
              placeholder="teammate@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <div className="dialog-actions">
            <Button onClick={() => setInviteOpen(false)} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add invitation <ArrowRight size={15} />
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
function Components() {
  const [checked, setChecked] = useState(true);
  const [on, setOn] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <div className="component-grid">
      <Card className="specimen">
        <div className="specimen-heading">
          <h3>Buttons</h3>
          <span className="eyebrow">01 / ACTIONS</span>
        </div>
        <p className="muted">A clear hierarchy, with room to breathe.</p>
        <div className="component-row">
          <Button
            variant="primary"
            onClick={() => setMessage("Primary action selected")}
          >
            Create project <Plus size={15} />
          </Button>
          <Button onClick={() => setMessage("Secondary action selected")}>
            Secondary
          </Button>
          <Button
            variant="ghost"
            onClick={() => setMessage("Ghost action selected")}
          >
            Ghost <ArrowUpRight size={15} />
          </Button>
        </div>
        <div className="component-row">
          <Button disabled>Disabled</Button>
          <Button
            variant="danger"
            onClick={() => setMessage("Destructive action preview selected")}
          >
            Delete project
          </Button>
        </div>
        <p role="status" className="control-note">
          {message ||
            "Keyboard focus, hover, pressed, and disabled states included."}
        </p>
      </Card>
      <Card className="specimen">
        <div className="specimen-heading">
          <h3>Inputs</h3>
          <span className="eyebrow">02 / DATA ENTRY</span>
        </div>
        <label className="field-label">
          Project name
          <Input placeholder="e.g. Mobile onboarding" />
        </label>
        <label className="field-label">
          Email address
          <Input
            defaultValue="hello@"
            aria-invalid="true"
            aria-describedby="email-error"
          />
          <small id="email-error" className="error-text">
            Enter a complete email address.
          </small>
        </label>
      </Card>
      <Card className="specimen">
        <div className="specimen-heading">
          <h3>Selection</h3>
          <span className="eyebrow">03 / CONTROLS</span>
        </div>
        <div className="control-stack">
          <Switch
            label="Email notifications"
            checked={on}
            onCheckedChange={setOn}
          />
          <Checkbox
            label="Include archived projects"
            checked={checked}
            onCheckedChange={setChecked}
          />
          <Checkbox label="Unavailable option" disabled />
        </div>
      </Card>
      <Card className="specimen">
        <div className="specimen-heading">
          <h3>Status & overlays</h3>
          <span className="eyebrow">04 / FEEDBACK</span>
        </div>
        <div className="component-row">
          <Badge>Draft</Badge>
          <Badge tone="accent">In progress</Badge>
          <Badge tone="success">Completed</Badge>
          <Badge tone="danger">Blocked</Badge>
        </div>
        <Button onClick={() => setOpen(true)}>
          Open dialog <ArrowUpRight size={15} />
        </Button>
        <p className="control-note">
          Focus trapping, Escape dismissal, and focus restoration.
        </p>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Every detail, considered."
          description="A reusable Base UI dialog. Try Tab, Shift+Tab, and Escape."
        >
          <div className="dialog-actions">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Got it <Check size={16} />
            </Button>
          </div>
        </Dialog>
      </Card>
    </div>
  );
}
function Foundations() {
  const { settings } = useTheme();
  const palette = tokens.themes[settings.theme][settings.mode];
  return (
    <div className="foundations">
      <Card className="specimen">
        <div className="specimen-heading">
          <h3>Semantic color</h3>
          <Badge>
            {settings.theme} / {settings.mode}
          </Badge>
        </div>
        <p className="muted">
          Name colors by purpose. Change themes without changing components.
        </p>
        <div className="color-grid">
          {Object.entries(palette).map(([key, value]) => (
            <div key={key}>
              <span className="color-chip" style={{ background: value }} />
              <strong>{key}</strong>
              <code>{value}</code>
            </div>
          ))}
        </div>
      </Card>
      <div className="component-grid">
        <Card className="specimen">
          <h3>Typography</h3>
          <p className="muted">
            System sans. Familiar, fast, and platform aware.
          </p>
          <div className="type-specimens">
            <span className="type-display">Clarity by design.</span>
            <span className="type-heading">A foundation for good work.</span>
            <span>Balanced body text for everyday interfaces.</span>
            <small className="muted">Supporting details stay readable.</small>
            <code>const precision = true;</code>
          </div>
        </Card>
        <Card className="specimen">
          <h3>Spacing</h3>
          <p className="muted">A shared 4px scale for deliberate rhythm.</p>
          <div className="space-specimens">
            {Object.entries(tokens.space)
              .slice(0, 8)
              .map(([key, value]) => (
                <div key={key}>
                  <code>{key}</code>
                  <span style={{ width: `${value * 3}px` }} />
                  <small>{value}px</small>
                </div>
              ))}
          </div>
        </Card>
      </div>
      <Card className="specimen">
        <h3>Interaction principles</h3>
        <div className="principles">
          <div>
            <strong>Visible focus</strong>
            <p>
              Every control has a distinct focus ring. Base UI manages keyboard
              interaction.
            </p>
          </div>
          <div>
            <strong>Responsive by default</strong>
            <p>
              Fluid layouts, scrollable tables, and 44px controls on touch
              devices.
            </p>
          </div>
          <div>
            <strong>Purposeful motion</strong>
            <p>
              120–180ms transitions. Respect the user’s reduced-motion
              preference.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
function AgentGuide() {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(agentText);
      setCopied(true);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }
  return (
    <div className="guide">
      <Card className="guide-hero">
        <span className="guide-icon">
          <Code2 size={26} />
        </span>
        <h2>
          A common language.
          <br />
          For you and your agent.
        </h2>
        <p className="muted">
          The components, tokens, and rules live together. Give your coding
          agent the context to build consistent interfaces.
        </p>
        <Button variant="primary" onClick={copy}>
          {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
          {copied ? "Prompt copied" : "Copy starter prompt"}
        </Button>
        {failed && (
          <p role="status">
            Clipboard unavailable. Select the prompt below to copy it.
          </p>
        )}
      </Card>
      <Card className="specimen">
        <h3>Start with this prompt</h3>
        <pre className="prompt-code">{agentText}</pre>
      </Card>
      <div className="component-grid">
        {[
          {
            file: "GUI.md",
            title: "The design contract",
            text: "Principles, component APIs, token conventions, and accessibility checks.",
          },
          {
            file: "src/system/tokens.json",
            title: "One source of truth",
            text: "Portable palettes, scales, typography, and motion for web and native mapping.",
          },
          {
            file: "src/system/index.ts",
            title: "Reusable components",
            text: "A small public API built on Base UI. Application logic stays outside the system.",
          },
          {
            file: "README.md",
            title: "A practical starting point",
            text: "Setup, theming, adding a theme, exports, and the path to native applications.",
          },
        ].map((item) => (
          <Card className="specimen" key={item.file}>
            <code className="file-label">{item.file}</code>
            <h3>{item.title}</h3>
            <p className="muted">{item.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
export default function App() {
  const [page, setPage] = useState("Theme studio");
  const [mobileNav, setMobileNav] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [format, setFormat] = useState("css");
  const [exported, setExported] = useState(false);
  const { settings, update } = useTheme();
  const descriptions: Record<string, string> = {
    "Theme studio": "A considered foundation. An expression that’s yours.",
    Components: "Small building blocks. Consistent in every context.",
    Foundations: "The decisions behind every detail.",
    "Agent guide": "Everything your coding agent needs to stay in sync.",
  };
  function exportFile() {
    const base = `precision-${settings.theme}-${settings.mode}`;
    if (format === "css")
      download(`${base}.css`, exportCSS(settings), "text/css");
    else if (format === "json")
      download(
        `${base}.json`,
        JSON.stringify(exportTheme(settings), null, 2),
        "application/json",
      );
    else download("precision-agent-prompt.md", agentText, "text/markdown");
    setExported(true);
  }
  return (
    <div className="studio-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setPage("Theme studio");
          }}
        >
          <span className="brand-mark">
            <i />
            <i />
            <i />
          </span>
          <span>
            precision<span className="brand-period">.</span>
          </span>
        </a>
        <div className="sidebar-caption">
          DESIGN SYSTEM <Badge>v0.0.1</Badge>
        </div>
        <nav aria-label="Design system">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              className={`nav-item ${page === label ? "active" : ""}`}
              key={label}
              aria-current={page === label ? "page" : undefined}
              onClick={() => {
                setPage(label);
                setMobileNav(false);
              }}
            >
              <Icon size={17} />
              {label}
              {page === label && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <Sparkles size={17} />
            <strong>Built to stay consistent.</strong>
            <p>
              One system. Many products.
              <br />
              Every detail in sync.
            </p>
          </div>
          <div className="stack-label">
            <span className="status-dot" /> React + Base UI{" "}
            <ArrowUpRight size={13} />
          </div>
        </div>
      </aside>
      {mobileNav && (
        <button
          className="nav-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
        />
      )}
      <div className="studio-main">
        <header className="topbar">
          <div className="breadcrumb">
            <Button
              className="icon-button mobile-menu"
              variant="ghost"
              aria-label={mobileNav ? "Close navigation" : "Open navigation"}
              onClick={() => setMobileNav(!mobileNav)}
            >
              {mobileNav ? <X size={18} /> : <Menu size={18} />}
            </Button>
            <span>Design system</span>
            <ChevronRight size={13} />
            <strong>{page}</strong>
          </div>
          <div className="topbar-actions">
            <span className="local-badge">
              <span className="status-dot" /> Local workspace
            </span>
            <Button
              className="icon-button"
              variant="ghost"
              aria-label={`Switch to ${settings.mode === "light" ? "dark" : "light"} mode`}
              onClick={() =>
                update({ mode: settings.mode === "light" ? "dark" : "light" })
              }
            >
              {settings.mode === "light" ? (
                <Moon size={17} />
              ) : (
                <Sun size={17} />
              )}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setExportOpen(true);
                setExported(false);
              }}
            >
              <ArrowDownToLine size={15} /> Export theme
            </Button>
          </div>
        </header>
        <main className="main-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow heading-eyebrow">
                <span className="small-line" /> THE PRECISION SYSTEM
              </div>
              <h1>{page}</h1>
              <p>{descriptions[page]}</p>
            </div>
            <span className="page-counter">
              {String(
                navigation.findIndex((n) => n.label === page) + 1,
              ).padStart(2, "0")}{" "}
              <span>/ 04</span>
            </span>
          </div>
          {page === "Theme studio" ? (
            <div className="studio-grid">
              <Inspector />
              <div className="preview-area">
                <div className="preview-heading">
                  <div>
                    <span className="status-dot" />
                    <strong>Live preview</strong>
                    <span className="preview-divider" />
                    <span>Example application</span>
                  </div>
                  <span className="preview-device">
                    <LayoutDashboard size={14} /> Responsive
                  </span>
                </div>
                <Workspace />
                <div className="preview-caption">
                  <span>
                    <Check size={13} /> Shared tokens. Real components. Live
                    changes.
                  </span>
                  <button onClick={() => setPage("Components")}>
                    Explore components <ArrowRight size={13} />
                  </button>
                </div>
                <div className="system-notes">
                  <div>
                    <Layers3 size={18} />
                    <strong>Two themes. One foundation.</strong>
                    <p>Swap the expression, keep the structure.</p>
                  </div>
                  <div>
                    <Code2 size={18} />
                    <strong>Ready for your agent.</strong>
                    <p>A shared contract for consistent work.</p>
                  </div>
                  <div>
                    <Users size={18} />
                    <strong>Made for every screen.</strong>
                    <p>Balanced on desktop. Comfortable on mobile.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : page === "Components" ? (
            <Components />
          ) : page === "Foundations" ? (
            <Foundations />
          ) : (
            <AgentGuide />
          )}
          <footer className="main-footer">
            <span>
              PRECISION <span className="footer-dot">·</span> A foundation,
              thoughtfully made.
            </span>
            <span>
              {tokens.themes[settings.theme].label}{" "}
              <span className="footer-dot">/</span> {settings.mode}
            </span>
          </footer>
        </main>
      </div>
      <Dialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        title="Take your theme with you."
        description="Export the current settings, resolved tokens, or an agent starter prompt."
      >
        <label className="select-label">
          Export format
          <select
            value={format}
            onChange={(e) => {
              setFormat(e.target.value);
              setExported(false);
            }}
          >
            <option value="css">CSS variables · current appearance</option>
            <option value="json">JSON · settings & all theme tokens</option>
            <option value="agent">Agent starter prompt · Markdown</option>
          </select>
        </label>
        <pre className="export-preview">
          {format === "css"
            ? exportCSS(settings)
            : format === "json"
              ? JSON.stringify(exportTheme(settings), null, 2)
              : agentText}
        </pre>
        <div className="dialog-actions">
          <Button onClick={() => setExportOpen(false)}>Close</Button>
          <Button variant="primary" onClick={exportFile}>
            <ArrowDownToLine size={15} /> Download{" "}
            {format === "agent" ? "Markdown" : format.toUpperCase()}
          </Button>
        </div>
        {exported && (
          <p role="status" className="positive">
            Your export is ready in Downloads.
          </p>
        )}
      </Dialog>
    </div>
  );
}
