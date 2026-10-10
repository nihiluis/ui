import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, Button, Input, Dialog, useTheme } from "precision-ui";
import "./styles.css";

function Consumer() {
  const { update } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <main className="p-precision-6">
      <div
        id="surface"
        className="bg-surface text-content border border-border rounded-precision shadow-precision font-precision-sans text-precision-body p-precision-4"
      >
        Semantic tokens
      </div>
      <div id="dark-variant" className="opacity-100 dark:opacity-50">
        Appearance variant
      </div>
      <div id="width-container" className="w-80 max-w-full">
        <Button
          id="override"
          className="w-full md:w-auto px-8 bg-accent text-on-accent rounded-none hover:bg-danger"
        >
          Utility override
        </Button>
      </div>
      <Button id="default" variant="primary">
        Default button
      </Button>
      <Input aria-label="Example input" placeholder="Input with Preflight" />
      <Button
        onClick={() =>
          update({
            theme: "graphite",
            mode: "light",
            accent: "iris",
            radius: "balanced",
          })
        }
      >
        Graphite light
      </Button>
      <Button
        onClick={() =>
          update({
            theme: "graphite",
            mode: "dark",
            accent: "iris",
            radius: "balanced",
          })
        }
      >
        Graphite dark
      </Button>
      <Button
        onClick={() =>
          update({
            theme: "mineral",
            mode: "light",
            accent: "teal",
            radius: "soft",
          })
        }
      >
        Mineral light
      </Button>
      <Button
        onClick={() =>
          update({
            theme: "mineral",
            mode: "dark",
            accent: "teal",
            radius: "soft",
          })
        }
      >
        Mineral dark
      </Button>
      <Button onClick={() => setOpen(true)}>Open themed dialog</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Themed dialog"
        description="Portal uses the same Tailwind-compatible styles."
      >
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Dialog>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <Consumer />
  </ThemeProvider>,
);
