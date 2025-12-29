import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import styles from "./button.module.css";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<BaseButton.Props, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <BaseButton className={classes} {...props}>
      {children}
    </BaseButton>
  );
}
