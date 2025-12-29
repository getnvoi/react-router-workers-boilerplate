import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import styles from "./switch.module.css";

interface SwitchProps extends Omit<BaseSwitch.Root.Props, "className"> {
  label?: string;
  className?: string;
}

export function Switch({ label, className = "", ...props }: SwitchProps) {
  const switchElement = (
    <BaseSwitch.Root className={`${styles.root} ${className}`} {...props}>
      <BaseSwitch.Thumb className={styles.thumb} />
    </BaseSwitch.Root>
  );

  if (label) {
    return (
      <label className={styles.label}>
        {switchElement}
        <span>{label}</span>
      </label>
    );
  }

  return switchElement;
}
