import * as React from "react";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import styles from "./toggle.module.css";

type ToggleVariant = "default" | "outline" | "ghost";
type ToggleSize = "sm" | "md" | "lg";

interface ToggleProps extends Omit<BaseToggle.Root.Props, "className"> {
  variant?: ToggleVariant;
  size?: ToggleSize;
  className?: string;
}

export function Toggle({
  variant = "default",
  size = "md",
  className = "",
  children,
  ...props
}: ToggleProps) {
  const classes = [styles.root, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <BaseToggle.Root className={classes} {...props}>
      {children}
    </BaseToggle.Root>
  );
}
