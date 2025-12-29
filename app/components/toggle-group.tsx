import * as React from "react";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import styles from "./toggle-group.module.css";

type ToggleGroupVariant = "default" | "outline" | "ghost";
type ToggleGroupSize = "sm" | "md" | "lg";

export interface ToggleGroupOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

interface ToggleGroupProps {
  options: ToggleGroupOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize;
  className?: string;
}

export function ToggleGroup({
  options,
  value,
  defaultValue,
  onChange,
  multiple = false,
  disabled = false,
  variant = "default",
  size = "md",
  className = "",
}: ToggleGroupProps) {
  const handleValueChange = (newValue: string | string[] | null) => {
    onChange?.(newValue ?? (multiple ? [] : ""));
  };

  const rootClasses = [styles.root, className].filter(Boolean).join(" ");

  const itemClasses = [styles.item, styles[variant], styles[size]]
    .filter(Boolean)
    .join(" ");

  return (
    <BaseToggleGroup.Root
      className={rootClasses}
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      multiple={multiple}
      disabled={disabled}
    >
      {options.map((option) => (
        <BaseToggleGroup.Item
          key={option.value}
          value={option.value}
          className={itemClasses}
          disabled={option.disabled}
        >
          {option.label}
        </BaseToggleGroup.Item>
      ))}
    </BaseToggleGroup.Root>
  );
}
