import * as React from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { ChevronDown, X, Check, Loader2, Plus } from "lucide-react";
import styles from "./combobox.module.css";
import type { ComboboxOption } from "./combobox";

interface ComboboxAsyncCreatableProps {
  onSearch: (query: string) => Promise<ComboboxOption[]>;
  onCreate: (value: string) => void | Promise<void>;
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  errorMessage?: string;
  createLabel?: string;
  allowCreate?: (value: string) => boolean;
  debounceMs?: number;
  minSearchLength?: number;
  className?: string;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function ComboboxAsyncCreatable({
  onSearch,
  onCreate,
  value,
  defaultValue,
  onChange,
  placeholder = "Search or create...",
  multiple = false,
  disabled = false,
  emptyMessage = "No results found",
  loadingMessage = "Loading...",
  errorMessage = "Failed to load results",
  createLabel = 'Create "{value}"',
  allowCreate = () => true,
  debounceMs = 300,
  minSearchLength = 0,
  className = "",
}: ComboboxAsyncCreatableProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<ComboboxOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);

  const debouncedInputValue = useDebounce(inputValue, debounceMs);

  // Fetch options when debounced input changes
  React.useEffect(() => {
    if (!open) return;
    if (debouncedInputValue.length < minSearchLength) {
      setOptions([]);
      return;
    }

    const fetchOptions = async () => {
      setLoading(true);
      setError(false);

      try {
        const results = await onSearch(debouncedInputValue);
        setOptions(results);
      } catch (err) {
        console.error("ComboboxAsyncCreatable search error:", err);
        setError(true);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [debouncedInputValue, minSearchLength, onSearch, open]);

  // Check if the input value matches an existing option
  const exactMatch = React.useMemo(() => {
    return options.some(
      (opt) => opt.label.toLowerCase() === inputValue.toLowerCase()
    );
  }, [options, inputValue]);

  // Determine if we should show the create option
  const shouldShowCreate = React.useMemo(() => {
    return (
      inputValue.trim() !== "" &&
      !exactMatch &&
      allowCreate(inputValue) &&
      !isCreating &&
      !loading
    );
  }, [inputValue, exactMatch, allowCreate, isCreating, loading]);

  // Get selected option(s) for display
  const selectedOptions = React.useMemo(() => {
    if (!value) return [];
    const values = Array.isArray(value) ? value : [value];
    return options.filter((opt) => values.includes(opt.value));
  }, [value, options]);

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
      console.error("ComboboxAsyncCreatable onCreate error:", error);
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
        items={options}
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
            {loading ? (
              <div className={styles.loading}>
                <Loader2 size={16} className={styles.spinner} />
                <span>{loadingMessage}</span>
              </div>
            ) : error ? (
              <div className={styles.empty}>{errorMessage}</div>
            ) : options.length === 0 && !shouldShowCreate ? (
              <div className={styles.empty}>
                {inputValue.length < minSearchLength
                  ? `Type at least ${minSearchLength} characters to search`
                  : emptyMessage}
              </div>
            ) : (
              <>
                {options.length > 0 &&
                  options.map((option) => (
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
              </>
            )}

            <BaseCombobox.Status className="sr-only">
              {loading ? loadingMessage : ""}
            </BaseCombobox.Status>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Root>
    </div>
  );
}
