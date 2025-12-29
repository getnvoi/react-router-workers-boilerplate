import * as React from "react";
import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import styles from "./avatar.module.css";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string | null;
  alt: string;
  fallback?: string;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  className = "",
}: AvatarProps) {
  const fallbackText = fallback || alt.charAt(0).toUpperCase();

  const classes = [styles.avatar, styles[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <BaseAvatar.Root className={classes}>
      {src && <BaseAvatar.Image src={src} alt={alt} className={styles.image} />}
      <BaseAvatar.Fallback className={styles.fallback}>
        {fallbackText}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}
