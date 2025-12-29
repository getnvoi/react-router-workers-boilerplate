import * as React from "react";
import { Meter as BaseMeter } from "@base-ui/react/meter";
import styles from "./meter.module.css";

type MeterVariant = "default" | "success" | "warning" | "danger";

interface MeterProps extends Omit<BaseMeter.Root.Props, "className"> {
  label?: string;
  showValue?: boolean;
  variant?: MeterVariant;
  className?: string;
}

export function Meter({
  label,
  showValue = true,
  variant = "default",
  className = "",
  value,
  min = 0,
  max = 100,
  ...props
}: MeterProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && (
            <span className={styles.value}>
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <BaseMeter.Root
        className={styles.root}
        value={value}
        min={min}
        max={max}
        {...props}
      >
        <BaseMeter.Indicator
          className={`${styles.indicator} ${styles[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </BaseMeter.Root>
    </div>
  );
}
