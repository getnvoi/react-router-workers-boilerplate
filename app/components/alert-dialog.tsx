import * as React from "react";
import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import styles from "./alert-dialog.module.css";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  variant?: "danger" | "primary";
  children?: React.ReactNode;
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Confirm",
  onCancel,
  onConfirm,
  variant = "primary",
  children,
}: AlertDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  return (
    <BaseAlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop className={styles.backdrop} />
        <BaseAlertDialog.Popup className={styles.popup}>
          <BaseAlertDialog.Title className={styles.title}>
            {title}
          </BaseAlertDialog.Title>

          {description && (
            <BaseAlertDialog.Description className={styles.description}>
              {description}
            </BaseAlertDialog.Description>
          )}

          {children && <div className={styles.content}>{children}</div>}

          <div className={styles.actions}>
            <BaseAlertDialog.Close
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={handleCancel}
            >
              {cancelText}
            </BaseAlertDialog.Close>
            <button
              className={`${styles.button} ${styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`]}`}
              onClick={handleConfirm}
            >
              {confirmText}
            </button>
          </div>
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  );
}
