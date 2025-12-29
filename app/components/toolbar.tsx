import * as React from "react";
import { Toolbar as BaseToolbar } from "@base-ui/react/toolbar";
import styles from "./toolbar.module.css";

interface ToolbarProps {
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Toolbar({
  children,
  orientation = "horizontal",
  className = "",
}: ToolbarProps) {
  const classes = [styles.root, styles[orientation], className]
    .filter(Boolean)
    .join(" ");

  return <BaseToolbar className={classes}>{children}</BaseToolbar>;
}

interface ToolbarSeparatorProps {
  className?: string;
}

export function ToolbarSeparator({ className = "" }: ToolbarSeparatorProps) {
  return <div className={`${styles.separator} ${className}`} />;
}

Toolbar.Separator = ToolbarSeparator;
