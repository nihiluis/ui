import type { ComponentProps, ReactNode } from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { Input as BaseInput } from "@base-ui/react/input";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { Check, X } from "lucide-react";
const cx = (...values: (string | undefined)[]) =>
  values.filter(Boolean).join(" ");
export function Button({
  variant = "secondary",
  className,
  ...props
}: ComponentProps<typeof BaseButton> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <BaseButton
      {...props}
      className={cx(
        "button",
        `button-${variant}`,
        typeof className === "string" ? className : undefined,
      )}
    />
  );
}
export function Input({
  className,
  ...props
}: ComponentProps<typeof BaseInput>) {
  return (
    <BaseInput
      {...props}
      className={cx(
        "input",
        typeof className === "string" ? className : undefined,
      )}
    />
  );
}
export function Switch({
  label,
  ...props
}: ComponentProps<typeof BaseSwitch.Root> & { label: string }) {
  return (
    <label className="switch-label">
      <BaseSwitch.Root {...props} className="switch">
        <BaseSwitch.Thumb className="switch-thumb" />
      </BaseSwitch.Root>
      <span>{label}</span>
    </label>
  );
}
export function Checkbox({
  label,
  ...props
}: ComponentProps<typeof BaseCheckbox.Root> & { label: string }) {
  return (
    <label className="checkbox-label">
      <BaseCheckbox.Root {...props} className="checkbox">
        <BaseCheckbox.Indicator>
          <Check size={13} />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      <span>{label}</span>
    </label>
  );
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "accent" | "danger";
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`card ${className}`}>{children}</section>;
}
export function Tabs({
  items,
  value,
  onValueChange,
  label,
}: {
  items: { value: string; label: string; content: ReactNode }[];
  value: string;
  onValueChange: (value: string) => void;
  label: string;
}) {
  return (
    <BaseTabs.Root value={value} onValueChange={onValueChange}>
      <BaseTabs.List className="tabs" aria-label={label}>
        {items.map((item) => (
          <BaseTabs.Tab className="tab" value={item.value} key={item.value}>
            {item.label}
          </BaseTabs.Tab>
        ))}
      </BaseTabs.List>
      {items.map((item) => (
        <BaseTabs.Panel
          className="tab-panel"
          value={item.value}
          key={item.value}
        >
          {item.content}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
}
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="dialog-backdrop" />
        <BaseDialog.Popup className="dialog-popup">
          <div className="dialog-heading">
            <BaseDialog.Title>{title}</BaseDialog.Title>
            <BaseDialog.Close
              className="button button-ghost icon-button"
              aria-label="Close dialog"
            >
              <X size={18} />
            </BaseDialog.Close>
          </div>
          <BaseDialog.Description className="muted">
            {description}
          </BaseDialog.Description>
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
