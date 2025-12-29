import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check } from "lucide-react";
import styles from "./checkbox.module.css";

interface CheckboxProps
  extends Omit<BaseCheckbox.Root.Props, "className"> {
  label?: string;
  className?: string;
}

export function Checkbox({ label, className = "", ...props }: CheckboxProps) {
  const checkboxElement = (
    <BaseCheckbox.Root className={`${styles.root} ${className}`} {...props}>
      <BaseCheckbox.Indicator className={styles.indicator}>
        <Check size={12} strokeWidth={3} />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );

  if (label) {
    return (
      <label className={styles.label}>
        {checkboxElement}
        <span>{label}</span>
      </label>
    );
  }

  return checkboxElement;
}
