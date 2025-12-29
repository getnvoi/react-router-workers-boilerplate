import * as React from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import styles from "./tabs.module.css";

type TabsVariant = "line" | "enclosed" | "pills";
type TabsOrientation = "horizontal" | "vertical";

export interface Tab {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: TabsVariant;
  orientation?: TabsOrientation;
  className?: string;
}

export function Tabs({
  tabs,
  value,
  defaultValue,
  onChange,
  variant = "line",
  orientation = "horizontal",
  className = "",
}: TabsProps) {
  const handleValueChange = (newValue: string | null) => {
    if (newValue) {
      onChange?.(newValue);
    }
  };

  const rootClasses = [styles.root, styles[orientation], className]
    .filter(Boolean)
    .join(" ");

  const listClasses = [styles.list, styles[variant], styles[orientation]]
    .filter(Boolean)
    .join(" ");

  return (
    <BaseTabs.Root
      className={rootClasses}
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      orientation={orientation}
    >
      <BaseTabs.List className={listClasses}>
        {tabs.map((tab) => (
          <BaseTabs.Tab
            key={tab.value}
            value={tab.value}
            className={`${styles.tab} ${styles[variant]}`}
            disabled={tab.disabled}
          >
            {tab.label}
          </BaseTabs.Tab>
        ))}
      </BaseTabs.List>

      {tabs.map((tab) => (
        <BaseTabs.Panel
          key={tab.value}
          value={tab.value}
          className={styles.panel}
        >
          {tab.content}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
}

// Re-export compound components for advanced usage
Tabs.Root = BaseTabs.Root;
Tabs.List = BaseTabs.List;
Tabs.Tab = BaseTabs.Tab;
Tabs.Panel = BaseTabs.Panel;
