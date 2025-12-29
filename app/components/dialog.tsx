import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import styles from "./dialog.module.css";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  showClose?: boolean;
  className?: string;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  showClose = true,
  className = "",
}: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={styles.backdrop} />
        <BaseDialog.Popup className={`${styles.popup} ${className}`}>
          {showClose && (
            <BaseDialog.Close className={styles.close}>
              <X size={20} />
            </BaseDialog.Close>
          )}

          {title && (
            <BaseDialog.Title className={styles.title}>
              {title}
            </BaseDialog.Title>
          )}

          {description && (
            <BaseDialog.Description className={styles.description}>
              {description}
            </BaseDialog.Description>
          )}

          <div className={styles.content}>{children}</div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
