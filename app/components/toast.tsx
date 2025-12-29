import * as React from "react";
import { Toast as BaseToast, useToastManager } from "@base-ui/react/toast";
import styles from "./toast.module.css";

type ToastVariant = "info" | "success" | "warning" | "error";

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  return <BaseToast.Provider>{children}</BaseToast.Provider>;
}

interface ToastItemProps {
  variant?: ToastVariant;
  title?: string;
  description?: string;
}

function ToastItem({ variant = "info", title, description }: ToastItemProps) {
  const classes = [styles.root, styles[variant]].filter(Boolean).join(" ");

  return (
    <BaseToast.Root className={classes}>
      <div className={styles.content}>
        {title && <BaseToast.Title className={styles.title}>{title}</BaseToast.Title>}
        {description && (
          <BaseToast.Description className={styles.description}>
            {description}
          </BaseToast.Description>
        )}
      </div>
      <BaseToast.Close className={styles.close}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4L4 12M4 4L12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </BaseToast.Close>
    </BaseToast.Root>
  );
}

// Convenience hook for creating toasts
export function useToast() {
  const manager = useToastManager();

  const show = React.useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      return manager.push(
        <ToastItem variant={variant} title={title} description={description} />
      );
    },
    [manager]
  );

  const dismiss = React.useCallback(
    (id: number) => {
      manager.remove(id);
    },
    [manager]
  );

  const info = React.useCallback(
    (title: string, description?: string) => show("info", title, description),
    [show]
  );

  const success = React.useCallback(
    (title: string, description?: string) => show("success", title, description),
    [show]
  );

  const warning = React.useCallback(
    (title: string, description?: string) => show("warning", title, description),
    [show]
  );

  const error = React.useCallback(
    (title: string, description?: string) => show("error", title, description),
    [show]
  );

  return {
    show,
    dismiss,
    info,
    success,
    warning,
    error,
  };
}
