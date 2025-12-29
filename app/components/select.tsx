import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { ChevronDown, Check } from "lucide-react";
import styles from "./select.module.css";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface SelectProps {
  options: SelectOption[] | SelectGroup[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

// Type guard to check if options are grouped
function isGroupedOptions(
  options: SelectOption[] | SelectGroup[],
): options is SelectGroup[] {
  return options.length > 0 && "options" in options[0];
}

// Flatten grouped options
function flattenOptions(
  options: SelectOption[] | SelectGroup[],
): SelectOption[] {
  if (isGroupedOptions(options)) {
    return options.flatMap((group) => group.options);
  }
  return options;
}

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select...",
  multiple = false,
  disabled = false,
  className = "",
}: SelectProps) {
  const flatOptions = React.useMemo(() => flattenOptions(options), [options]);

  // Get selected option(s) for display
  const selectedOptions = React.useMemo(() => {
    if (!value) return [];
    const values = Array.isArray(value) ? value : [value];
    return flatOptions.filter((opt) => values.includes(opt.value));
  }, [value, flatOptions]);

  const handleValueChange = (newValue: string | string[] | null) => {
    onChange?.(newValue ?? (multiple ? [] : ""));
  };

  const displayValue = React.useMemo(() => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return placeholder;
    }
    if (!multiple && typeof value === "string") {
      return selectedOptions[0]?.label || placeholder;
    }
    if (multiple && Array.isArray(value)) {
      return `${value.length} selected`;
    }
    return placeholder;
  }, [value, multiple, selectedOptions, placeholder]);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <BaseSelect.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        disabled={disabled}
        multiple={multiple}
      >
        <BaseSelect.Trigger className={styles.trigger}>
          <span className={styles.value}>{displayValue}</span>
          <BaseSelect.Icon className={styles.icon}>
            <ChevronDown size={16} />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>

        <BaseSelect.Positioner className={styles.positioner}>
          <BaseSelect.Popup className={styles.popup}>
              {isGroupedOptions(options)
                ? // Render grouped options
                  options.map((group) => (
                    <BaseSelect.Group key={group.label}>
                      <BaseSelect.GroupLabel className={styles.groupLabel}>
                        {group.label}
                      </BaseSelect.GroupLabel>
                      {group.options.map((option) => (
                        <BaseSelect.Item
                          key={option.value}
                          value={option.value}
                          className={styles.item}
                          disabled={option.disabled}
                        >
                          <BaseSelect.ItemIndicator
                            className={styles.indicator}
                          >
                            <Check size={16} />
                          </BaseSelect.ItemIndicator>
                          <BaseSelect.ItemText>
                            {option.label}
                          </BaseSelect.ItemText>
                        </BaseSelect.Item>
                      ))}
                    </BaseSelect.Group>
                  ))
                : // Render flat options
                  flatOptions.map((option) => (
                    <BaseSelect.Item
                      key={option.value}
                      value={option.value}
                      className={styles.item}
                      disabled={option.disabled}
                    >
                      <BaseSelect.ItemIndicator className={styles.indicator}>
                        <Check size={16} />
                      </BaseSelect.ItemIndicator>
                      <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                    </BaseSelect.Item>
                  ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Root>
    </div>
  );
}
