import * as React from "react";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { Checkbox } from "./checkbox";
import styles from "./checkbox-group.module.css";

export interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function CheckboxGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  label,
  description,
  disabled = false,
  className = "",
  orientation = "vertical",
}: CheckboxGroupProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      {label && <div className={styles.label}>{label}</div>}
      {description && <div className={styles.description}>{description}</div>}

      <BaseCheckboxGroup.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        className={`${styles.root} ${styles[orientation]}`}
      >
        {options.map((option) => (
          <Checkbox
            key={option.value}
            name={option.value}
            value={option.value}
            disabled={option.disabled || disabled}
            label={option.label}
          />
        ))}
      </BaseCheckboxGroup.Root>
    </div>
  );
}
