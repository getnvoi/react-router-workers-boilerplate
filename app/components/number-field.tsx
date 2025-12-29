import * as React from "react";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { ChevronUp, ChevronDown } from "lucide-react";
import styles from "./number-field.module.css";

interface NumberFieldProps
  extends Omit<BaseNumberField.Root.Props, "className"> {
  label?: string;
  error?: string;
  showButtons?: boolean;
  className?: string;
}

export function NumberField({
  label,
  error,
  showButtons = true,
  className = "",
  ...props
}: NumberFieldProps) {
  const hasError = Boolean(error);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <BaseNumberField.Root className={styles.root} {...props}>
        <BaseNumberField.Group className={styles.group}>
          <BaseNumberField.Input
            className={`${styles.input} ${hasError ? styles.inputError : ""}`}
          />
          {showButtons && (
            <div className={styles.buttons}>
              <BaseNumberField.Increment className={styles.button}>
                <ChevronUp size={14} />
              </BaseNumberField.Increment>
              <BaseNumberField.Decrement className={styles.button}>
                <ChevronDown size={14} />
              </BaseNumberField.Decrement>
            </div>
          )}
        </BaseNumberField.Group>
        <BaseNumberField.ScrubArea className={styles.scrubArea}>
          <BaseNumberField.ScrubAreaCursor className={styles.scrubCursor} />
        </BaseNumberField.ScrubArea>
      </BaseNumberField.Root>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
