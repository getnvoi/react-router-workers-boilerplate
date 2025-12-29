import * as React from "react";
import { Menubar as BaseMenubar } from "@base-ui/react/menubar";
import { MenuItem, MenuItemRenderer } from "./menu-item";
import styles from "./menubar.module.css";

/**
 * Menubar Component - Horizontal menu bar with multiple menus
 *
 * @example
 * // Application menu bar
 * <Menubar
 *   menus={[
 *     {
 *       trigger: "File",
 *       items: [
 *         { label: "New File", icon: <FileIcon /> },
 *         { label: "Open", icon: <FolderIcon /> },
 *         { type: "separator" },
 *         { label: "Exit" }
 *       ]
 *     },
 *     {
 *       trigger: "Edit",
 *       items: [
 *         { label: "Cut" },
 *         { label: "Copy" },
 *         { label: "Paste" }
 *       ]
 *     },
 *     {
 *       trigger: "View",
 *       items: [
 *         { type: "checkbox", label: "Show Sidebar", checked: true },
 *         { type: "checkbox", label: "Show Toolbar" }
 *       ]
 *     }
 *   ]}
 * />
 *
 * @example
 * // With submenus
 * <Menubar
 *   menus={[
 *     {
 *       trigger: "Edit",
 *       items: [
 *         { label: "Cut" },
 *         {
 *           type: "submenu",
 *           label: "Transform",
 *           items: [
 *             { label: "Uppercase" },
 *             { label: "Lowercase" }
 *           ]
 *         }
 *       ]
 *     }
 *   ]}
 * />
 */

export type { MenuItem };

export interface MenubarMenu {
  trigger: string;
  items: MenuItem[];
}

interface MenubarProps {
  menus: MenubarMenu[];
  className?: string;
}

export function Menubar({ menus, className = "" }: MenubarProps) {
  return (
    <BaseMenubar.Root className={`${styles.root} ${className}`}>
      {menus.map((menu, menuIndex) => (
        <BaseMenubar.Menu key={menuIndex}>
          <BaseMenubar.Trigger className={styles.trigger}>
            {menu.trigger}
          </BaseMenubar.Trigger>
          <BaseMenubar.Positioner className={styles.positioner}>
            <BaseMenubar.Popup className={styles.popup}>
              {menu.items.map((item, itemIndex) => (
                <MenuItemRenderer
                  key={itemIndex}
                  item={item}
                  components={{
                    Item: BaseMenubar.Item,
                    CheckboxItem: BaseMenubar.CheckboxItem,
                    CheckboxItemIndicator: BaseMenubar.CheckboxItemIndicator,
                    RadioItem: BaseMenubar.RadioItem,
                    RadioItemIndicator: BaseMenubar.RadioItemIndicator,
                    Separator: BaseMenubar.Separator,
                    SubmenuTrigger: BaseMenubar.SubmenuTrigger,
                    Positioner: BaseMenubar.Positioner,
                    Popup: BaseMenubar.Popup,
                  }}
                  styles={styles}
                />
              ))}
            </BaseMenubar.Popup>
          </BaseMenubar.Positioner>
        </BaseMenubar.Menu>
      ))}
    </BaseMenubar.Root>
  );
}
