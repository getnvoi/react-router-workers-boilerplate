import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import styles from "./tooltip.module.css";

type TooltipSide = "top" | "right" | "bottom" | "left";
type TooltipAlign = "start" | "center" | "end";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: TooltipSide;
  align?: TooltipAlign;
  sideOffset?: number;
  alignOffset?: number;
  delayEnter?: number;
  delayLeave?: number;
  showArrow?: boolean;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  sideOffset = 8,
  alignOffset = 0,
  delayEnter = 200,
  delayLeave = 0,
  showArrow = true,
  className = "",
}: TooltipProps) {
  return (
    <BaseTooltip.Root delay={delayEnter} closeDelay={delayLeave}>
      <BaseTooltip.Trigger className={styles.trigger}>
        {children}
      </BaseTooltip.Trigger>
      <BaseTooltip.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
      >
        <BaseTooltip.Popup className={`${styles.popup} ${className}`}>
          {content}
          {showArrow && (
            <BaseTooltip.Arrow className={styles.arrow}>
              <div className={styles.arrowInner} />
            </BaseTooltip.Arrow>
          )}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Root>
  );
}
