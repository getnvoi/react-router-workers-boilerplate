import * as React from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { ChevronDown, X, Check, Plus } from "lucide-react";
import styles from "./combobox.module.css";
import type { ComboboxOption, ComboboxGroup } from "./combobox";

interface ComboboxCreatableProps {
  options: ComboboxOption[] | ComboboxGroup[];
  onCreate: (value: string) => void | Promise<void>;
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  emptyMessage?: string;
  createLabel?: string;
  allowCreate?: (value: string) => boolean;
  className?: string;
}

// Type guard to check if options are grouped
function isGroupedOptions(
  options: ComboboxOption[] | ComboboxGroup[]
): options is ComboboxGroup[] {
  return options.length > 0 && "options" in options[0];
}

// Flatten grouped options for filtering
function flattenOptions(
  options: ComboboxOption[] | ComboboxGroup[]
): ComboboxOption[] {
  if (isGroupedOptions(options)) {
    return options.flatMap((group) => group.options);
  }
  return options;
}

// Filter options based on search query
function filterOptions(
  options: ComboboxOption[],
  query: string
): ComboboxOption[] {
  if (!query.trim()) return options;
  const lowerQuery = query.toLowerCase();
  return options.filter((option) =>
    option.label.toLowerCase().includes(lowerQuery)
  );
}

export function ComboboxCreatable({
  options,
  onCreate,
  value,
  defaultValue,
  onChange,
  placeholder = "Select or create...",
  multiple = false,
  disabled = false,
  searchable = true,
  emptyMessage = "No options found",
  createLabel = 'Create "{value}"',
  allowCreate = () => true,
  className = "",
}: ComboboxCreatableProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  const flatOptions = React.useMemo(
    () => flattenOptions(options),
    [options]
  );

  const filteredOptions = React.useMemo(
    () => (searchable ? filterOptions(flatOptions, inputValue) : flatOptions),
    [flatOptions, inputValue, searchable]
  );

  // Check if the input value matches an existing option
  const exactMatch = React.useMemo(() => {
    return flatOptions.some(
      (opt) => opt.label.toLowerCase() === inputValue.toLowerCase()
    );
  }, [flatOptions, inputValue]);

  // Determine if we should show the create option
  const shouldShowCreate = React.useMemo(() => {
    return (
      inputValue.trim() !== "" &&
      !exactMatch &&
      allowCreate(inputValue) &&
      !isCreating
    );
  }, [inputValue, exactMatch, allowCreate, isCreating]);

  // Get selected option(s) for display
  const selectedOptions = React.useMemo(() => {
    if (!value) return [];
    const values = Array.isArray(value) ? value : [value];
    return flatOptions.filter((opt) => values.includes(opt.value));
  }, [value, flatOptions]);

  const handleRemoveChip = (optionValue: string) => {
    if (!multiple || !Array.isArray(value)) return;
    const newValue = value.filter((v) => v !== optionValue);
    onChange?.(newValue);
  };

  const handleValueChange = (newValue: string | string[] | null) => {
    onChange?.(newValue ?? (multiple ? [] : ""));
  };

  const handleCreate = async () => {
    if (!shouldShowCreate) return;

    setIsCreating(true);
    try {
      await onCreate(inputValue);
      setInputValue("");
    } catch (error) {
      console.error("ComboboxCreatable onCreate error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const displayValue = React.useMemo(() => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return placeholder;
    }
    if (!multiple && typeof value === "string") {
      return selectedOptions[0]?.label || placeholder;
    }
    return placeholder;
  }, [value, multiple, selectedOptions, placeholder]);

  const createLabelText = createLabel.replace("{value}", inputValue);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <BaseCombobox.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        open={open}
        onOpenChange={setOpen}
        items={filteredOptions}
        itemToString={(item) => (item as ComboboxOption)?.label ?? ""}
        multiple={multiple}
        disabled={disabled}
      >
        <div className={styles.container}>
          {/* Selected chips for multi-select */}
          {multiple && Array.isArray(value) && value.length > 0 && (
            <div className={styles.chips}>
              {selectedOptions.map((option) => (
                <div key={option.value} className={styles.chip}>
                  <span>{option.label}</span>
                  <button
                    type="button"
                    className={styles.chipRemove}
                    onClick={() => handleRemoveChip(option.value)}
                    disabled={disabled}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className={styles.inputWrapper}>
            <BaseCombobox.Input
              className={styles.input}
              placeholder={displayValue}
              value={inputValue}
              onValueChange={setInputValue}
              disabled={disabled}
            />
            <button
              type="button"
              className={styles.trigger}
              onClick={() => setOpen(!open)}
              disabled={disabled}
            >
              <ChevronDown size={16} className={styles.chevron} />
            </button>
          </div>
        </div>

        <BaseCombobox.Positioner className={styles.positioner}>
          <BaseCombobox.Popup className={styles.popup}>
            <BaseCombobox.Listbox className={styles.listbox}>
              {isGroupedOptions(options) ? (
                // Render grouped options
                options.map((group) => {
                  const groupFilteredOptions = filterOptions(
                    group.options,
                    inputValue
                  );
                  if (groupFilteredOptions.length === 0) return null;

                  return (
                    <BaseCombobox.Group key={group.label}>
                      <BaseCombobox.GroupLabel className={styles.groupLabel}>
                        {group.label}
                      </BaseCombobox.GroupLabel>
                      {groupFilteredOptions.map((option) => (
                        <BaseCombobox.Item
                          key={option.value}
                          value={option.value}
                          className={styles.item}
                          disabled={option.disabled}
                        >
                          <Check size={16} className={styles.checkIcon} />
                          <span>{option.label}</span>
                        </BaseCombobox.Item>
                      ))}
                    </BaseCombobox.Group>
                  );
                })
              ) : (
                // Render flat options
                filteredOptions.map((option) => (
                  <BaseCombobox.Item
                    key={option.value}
                    value={option.value}
                    className={styles.item}
                    disabled={option.disabled}
                  >
                    <Check size={16} className={styles.checkIcon} />
                    <span>{option.label}</span>
                  </BaseCombobox.Item>
                ))
              )}
            </BaseCombobox.Listbox>

            {/* Create option */}
            {shouldShowCreate && (
              <button
                type="button"
                className={styles.createItem}
                onClick={handleCreate}
                disabled={isCreating}
              >
                <Plus size={16} />
                <span>{createLabelText}</span>
              </button>
            )}

            {filteredOptions.length === 0 && !shouldShowCreate && (
              <div className={styles.empty}>{emptyMessage}</div>
            )}
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Root>
    </div>
  );
}
