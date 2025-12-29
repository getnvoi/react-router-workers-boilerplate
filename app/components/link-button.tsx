import * as React from "react";
import { Link } from "react-router";
import { Button } from "./button";
import type { Button as BaseButton } from "@base-ui/react/button";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface LinkButtonProps
  extends Omit<BaseButton.Props, "className" | "render"> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/**
 * LinkButton - A Button component that renders as a React Router Link
 *
 * Automatically sets nativeButton={false} and render={<Link />}
 * so you don't have to remember the Base UI pattern.
 *
 * @example
 * <LinkButton variant="primary" href="/dashboard">
 *   Go to Dashboard
 * </LinkButton>
 *
 * @example
 * <LinkButton variant="secondary" size="sm" href="/settings">
 *   Settings
 * </LinkButton>
 */
export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      render={<Link to={href} />}
      nativeButton={false}
      {...props}
    >
      {children}
    </Button>
  );
}
