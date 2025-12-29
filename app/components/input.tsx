import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import styles from "./input.module.css";

interface InputProps extends Omit<BaseInput.Props, "className"> {
  className?: string;
}

export function Input({ className = "", ...props }: InputProps) {
  return <BaseInput className={`${styles.input} ${className}`} {...props} />;
}
