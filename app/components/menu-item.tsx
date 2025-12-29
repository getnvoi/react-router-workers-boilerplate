import * as React from "react";
import { Check, ChevronRight } from "lucide-react";

/**
 * Shared MenuItem type and component for Menu and Menubar
 */

export interface MenuItem {
  type?: "item" | "checkbox" | "radio" | "separator" | "submenu";
  value?: string;
  label?: string;
  disabled?: boolean;
  checked?: boolean;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface MenuItemRendererProps {
  item: MenuItem;
  components: {
    Item: React.ComponentType<any>;
    CheckboxItem: React.ComponentType<any>;
    CheckboxItemIndicator: React.ComponentType<any>;
    RadioItem: React.ComponentType<any>;
    RadioItemIndicator: React.ComponentType<any>;
    Separator: React.ComponentType<any>;
    SubmenuTrigger: React.ComponentType<any>;
    Positioner: React.ComponentType<any>;
    Popup: React.ComponentType<any>;
  };
  styles: {
    item: string;
    separator: string;
    icon: string;
    itemLabel: string;
    indicator: string;
    chevron: string;
    positioner: string;
    popup: string;
  };
}

export function MenuItemRenderer({
  item,
  components,
  styles,
}: MenuItemRendererProps): React.ReactElement | null {
  const {
    Item,
    CheckboxItem,
    CheckboxItemIndicator,
    RadioItem,
    RadioItemIndicator,
    Separator,
    SubmenuTrigger,
    Positioner,
    Popup,
  } = components;

  if (item.type === "separator") {
    return <Separator className={styles.separator} />;
  }

  if (item.type === "submenu" && item.items) {
    return (
      <SubmenuTrigger className={styles.item}>
        {item.icon && <span className={styles.icon}>{item.icon}</span>}
        <span className={styles.itemLabel}>{item.label}</span>
        <ChevronRight size={14} className={styles.chevron} />
        <Positioner className={styles.positioner}>
          <Popup className={styles.popup}>
            {item.items.map((subItem, index) => (
              <MenuItemRenderer
                key={index}
                item={subItem}
                components={components}
                styles={styles}
              />
            ))}
          </Popup>
        </Positioner>
      </SubmenuTrigger>
    );
  }

  if (item.type === "checkbox") {
    return (
      <CheckboxItem
        className={styles.item}
        disabled={item.disabled}
        checked={item.checked}
      >
        <CheckboxItemIndicator className={styles.indicator}>
          <Check size={14} />
        </CheckboxItemIndicator>
        {item.icon && <span className={styles.icon}>{item.icon}</span>}
        <span className={styles.itemLabel}>{item.label}</span>
      </CheckboxItem>
    );
  }

  if (item.type === "radio") {
    return (
      <RadioItem
        className={styles.item}
        value={item.value || ""}
        disabled={item.disabled}
      >
        <RadioItemIndicator className={styles.indicator}>
          <Check size={14} />
        </RadioItemIndicator>
        {item.icon && <span className={styles.icon}>{item.icon}</span>}
        <span className={styles.itemLabel}>{item.label}</span>
      </RadioItem>
    );
  }

  return (
    <Item className={styles.item} disabled={item.disabled}>
      {item.icon && <span className={styles.icon}>{item.icon}</span>}
      <span className={styles.itemLabel}>{item.label}</span>
    </Item>
  );
}
