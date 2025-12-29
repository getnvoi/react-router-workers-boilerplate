import * as React from "react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";
import styles from "./accordion.module.css";

interface AccordionRootProps {
  children: React.ReactNode;
  defaultValue?: number[];
  value?: number[];
  onValueChange?: (value: number[]) => void;
  className?: string;
}

function AccordionRoot({
  children,
  defaultValue,
  value,
  onValueChange,
  className = "",
}: AccordionRootProps) {
  return (
    <BaseAccordion.Root
      className={`${styles.root} ${className}`}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
    >
      {children}
    </BaseAccordion.Root>
  );
}

interface AccordionItemProps {
  children: React.ReactNode;
  value: number;
  className?: string;
  disabled?: boolean;
}

function AccordionItem({
  children,
  value,
  className = "",
  disabled = false,
}: AccordionItemProps) {
  return (
    <BaseAccordion.Item
      className={`${styles.item} ${className}`}
      value={value}
      disabled={disabled}
    >
      {children}
    </BaseAccordion.Item>
  );
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

function AccordionTrigger({ children, className = "" }: AccordionTriggerProps) {
  return (
    <BaseAccordion.Header className={styles.header}>
      <BaseAccordion.Trigger className={`${styles.trigger} ${className}`}>
        {children}
        <ChevronDown className={styles.icon} size={16} />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

interface AccordionPanelProps {
  children: React.ReactNode;
  className?: string;
}

function AccordionPanel({ children, className = "" }: AccordionPanelProps) {
  return (
    <BaseAccordion.Panel className={`${styles.panel} ${className}`}>
      <div className={styles.panelContent}>{children}</div>
    </BaseAccordion.Panel>
  );
}

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
};
