import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import { X } from "lucide-react";
import styles from "./toast.module.css";

/**
 * Toast Component - Notification toast messages
 *
 * Note: Base UI Toast requires manual management. For a full toast system,
 * consider using a library like sonner or react-hot-toast.
 *
 * @example
 * // Basic toast
 * <Toast.Provider>
 *   <Toast.Root>
 *     <Toast.Title>Success</Toast.Title>
 *     <Toast.Description>Your changes have been saved.</Toast.Description>
 *     <Toast.Close />
 *   </Toast.Root>
 * </Toast.Provider>
 */

type ToastVariant = "info" | "success" | "warning" | "error";

interface ToastProviderProps extends BaseToast.Provider.Props {
  className?: string;
}

function ToastProvider({ className = "", ...props }: ToastProviderProps) {
  return <BaseToast.Provider className={className} {...props} />;
}

interface ToastRootProps extends BaseToast.Root.Props {
  className?: string;
  variant?: ToastVariant;
}

function ToastRoot({ className = "", variant = "info", ...props }: ToastRootProps) {
  const classes = [styles.root, styles[variant], className].filter(Boolean).join(" ");
  return <BaseToast.Root className={classes} {...props} />;
}

interface ToastTitleProps extends BaseToast.Title.Props {
  className?: string;
}

function ToastTitle({ className = "", ...props }: ToastTitleProps) {
  return <BaseToast.Title className={`${styles.title} ${className}`} {...props} />;
}

interface ToastDescriptionProps extends BaseToast.Description.Props {
  className?: string;
}

function ToastDescription({ className = "", ...props }: ToastDescriptionProps) {
  return <BaseToast.Description className={`${styles.description} ${className}`} {...props} />;
}

interface ToastCloseProps extends BaseToast.Close.Props {
  className?: string;
}

function ToastClose({ className = "", ...props }: ToastCloseProps) {
  return (
    <BaseToast.Close className={`${styles.close} ${className}`} {...props}>
      <X size={16} />
    </BaseToast.Close>
  );
}

export const Toast = {
  Provider: ToastProvider,
  Root: ToastRoot,
  Title: ToastTitle,
  Description: ToastDescription,
  Close: ToastClose,
};

// Re-export provider for convenience
export { ToastProvider };
