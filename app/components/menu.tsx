import * as React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { MenuItem, MenuItemRenderer } from "./menu-item";
import styles from "./menu.module.css";

/**
 * Menu Component - Single dropdown menu
 *
 * @example
 * // Basic dropdown menu
 * <Menu
 *   trigger={<button>Options</button>}
 *   items={[
 *     { label: "New File", icon: <FileIcon /> },
 *     { label: "Open", icon: <FolderIcon /> },
 *     { type: "separator" },
 *     { label: "Exit" }
 *   ]}
 * />
 *
 * @example
 * // With checkbox items
 * <Menu
 *   trigger={<button>View</button>}
 *   items={[
 *     { type: "checkbox", label: "Show Sidebar", checked: true },
 *     { type: "checkbox", label: "Show Toolbar", checked: false },
 *   ]}
 * />
 *
 * @example
 * // With submenu
 * <Menu
 *   trigger={<button>Edit</button>}
 *   items={[
 *     { label: "Cut" },
 *     { label: "Copy" },
 *     {
 *       type: "submenu",
 *       label: "Transform",
 *       items: [
 *         { label: "Uppercase" },
 *         { label: "Lowercase" }
 *       ]
 *     }
 *   ]}
 * />
 *
 * @example
 * // Context menu (right-click)
 * import { ContextMenuRoot, ContextMenuTrigger } from "@base-ui/react/menu";
 *
 * <ContextMenuRoot>
 *   <ContextMenuTrigger>
 *     <div>Right-click me</div>
 *   </ContextMenuTrigger>
 *   <Menu.Popup items={contextMenuItems} />
 * </ContextMenuRoot>
 */

export type { MenuItem };

interface MenuProps {
  items: MenuItem[];
  trigger: React.ReactNode;
  className?: string;
}

export function Menu({ items, trigger, className = "" }: MenuProps) {
  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger className={styles.trigger}>{trigger}</BaseMenu.Trigger>
      <BaseMenu.Positioner className={styles.positioner}>
        <BaseMenu.Popup className={`${styles.popup} ${className}`}>
          {items.map((item, index) => (
            <MenuItemRenderer
              key={index}
              item={item}
              components={{
                Item: BaseMenu.Item,
                CheckboxItem: BaseMenu.CheckboxItem,
                CheckboxItemIndicator: BaseMenu.CheckboxItemIndicator,
                RadioItem: BaseMenu.RadioItem,
                RadioItemIndicator: BaseMenu.RadioItemIndicator,
                Separator: BaseMenu.Separator,
                SubmenuTrigger: BaseMenu.SubmenuTrigger,
                Positioner: BaseMenu.Positioner,
                Popup: BaseMenu.Popup,
              }}
              styles={styles}
            />
          ))}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Root>
  );
}
