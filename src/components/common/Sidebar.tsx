"use client";
import { useState, useEffect, useMemo } from "react";
import { ChevronDown, X } from 'lucide-react'
import { Box, ScrollArea, Flex, IconButton } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import clsx from 'clsx';
import {
  IconDot, IconDashboard, IconSales, IconUI, IconPages, IconMenuLevel, IconDocs,
  IconSupport, IconMenu, IconInventory, IconSettings, IconWaste, IconLoyalty, IconPurchasing
} from './MenuIcons';

// Define types for menu items
interface SubSubMenuItem {
  title: string;
  link: string;
  target?: string;
}

interface SubMenuItem {
  title: string;
  link?: string;
  icon?: React.ReactNode;
  subMenu?: SubSubMenuItem[];
  target?: string;
}

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  link?: string;
  subMenu?: SubMenuItem[];
}

// 1. Create a MenuLink component for rendering links
const MenuLink = ({ 
  href, 
  isActive, 
  icon, 
  title, 
  className, 
  target, 
  level = 1,
  onClose
}: { 
  href: string; 
  isActive: boolean; 
  icon?: React.ReactNode; 
  title: string; 
  className?: string; 
  target?: string;
  level?: number;
  onClose?: () => void;
}) => {
  const padding = level === 1 ? "px-3" : level === 2 ? "pl-3.5 pr-2" : "pl-11 pr-2";
  
  return (
    <Link 
      href={href} 
      className={clsx(
        "flex items-center",
        level === 1 ? "py-2 gap-3 hover:bg-gray-100 dark:hover:bg-neutral-800" : level === 2 ? "gap-2.5" : "",
        padding,
        className
      )}
      target={target || undefined}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      onClick={onClose}
    >
      {level === 1 ? (
        <span
          className="flex justify-center items-center size-8 bg-gray-100 rounded-sm text-gray-400 dark:text-neutral-600 dark:bg-neutral-800"
          style={isActive ? 
            {color: 'var(--accent-9)', backgroundColor: 'var(--accent-2)'} : {}
          }
        >
          {icon}
        </span>
      ): (
        <span
          className="flex justify-center items-center size-8 rounded-sm"
          style={isActive ? {color: 'var(--accent-9)'} : {color: 'var(--color-gray-400)'}}
        >
          {icon || <IconDot />}
        </span>
      )}
      {level === 1 ? <span className="text-gray-500 font-semibold dark:text-neutral-400" style={isActive ? { color: 'var(--accent-9)' } : {}}>{title}</span>
       : <span className="text-gray-400 hover:text-gray-500 font-medium dark:text-neutral-400" style={isActive ? { color: 'var(--accent-9)' } : {}}>{title}</span>
      }
    </Link>
  );
};

// 2. Create a MenuButton component for accordion buttons
const MenuButton = ({ 
  title, 
  icon, 
  isOpen, 
  onClick, 
  level = 1 
}: { 
  title: string; 
  icon?: React.ReactNode; 
  isOpen: boolean; 
  onClick: () => void;
  level?: number;
}) => {
  const padding = level === 1 ? "pl-3 pr-3" : "pl-3.5 pr-2";
  
  return (
    <button 
      onClick={onClick} 
      className={clsx(
        "flex items-center w-full py-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800",
        level === 1 ? "gap-3" : "gap-2.5",
        padding
      )}
    >
      {level === 1 ? (
        icon && <span className="flex justify-center items-center size-8 bg-gray-100 rounded-sm text-gray-400 dark:text-neutral-600 dark:bg-neutral-800">{icon}</span>
      ) : (
        <span
          className="flex justify-center items-center size-8 rounded-sm"
          style={{color: 'var(--color-gray-400)'}}
        >
          {icon || <IconDot />}
        </span>
      )}
      {level === 1 ?
        <span className="text-gray-500 font-semibold dark:text-neutral-400">{title}</span>
        : <span className="text-gray-400 hover:text-gray-500 font-medium dark:text-neutral-400">{title}</span>
      }
      <ChevronDown className={clsx("size-3 ml-auto transition-transform", isOpen ? 'rotate-180' : '')} />
    </button>
  );
};

// 3. Create an Accordion component for expandable content
const Accordion = ({ 
  isOpen, 
  children 
}: { 
  isOpen: boolean; 
  children: React.ReactNode;
}) => {
  return (
    <div 
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ 
        maxHeight: isOpen ? 'none' : '0px',
        opacity: isOpen ? 1 : 0
      }}
    >
      <div className="flex flex-col space-y-1 py-1">
        {children}
      </div>
    </div>
  );
};

const MenuGroup = ({ 
  title, 
  menuData, 
  openMenu, 
  setOpenMenu, 
  openSubMenu, 
  setOpenSubMenu, 
  isActive,
  isBottomGroup = false,
  allExternalLinks = false,
  onClose
}: { 
  title: string; 
  menuData: MenuItem[]; 
  openMenu: string | null; 
  setOpenMenu: (menu: string | null) => void; 
  openSubMenu: string | null; 
  setOpenSubMenu: (menu: string | null) => void; 
  isActive: (link: string) => boolean;
  isBottomGroup?: boolean;
  allExternalLinks?: boolean;
  onClose?: () => void;
}) => {
  return (
    <Box mb={isBottomGroup ? undefined : "6"}>
      <div className="px-6 mb-3 text-[11px] font-semibold text-gray-400 uppercase dark:text-neutral-600">{title}</div>
      <Flex direction="column" gap="1" className="text-[14px]">
        {menuData.map((menuItem, index) => (
          <Box key={index}>
            {menuItem.subMenu ? (
              <div className="relative pl-2 pr-3">
                <MenuButton 
                  title={menuItem.title}
                  icon={menuItem.icon}
                  isOpen={openMenu === menuItem.title}
                  onClick={() => setOpenMenu(openMenu === menuItem.title ? null : menuItem.title)}
                />
                <Accordion isOpen={openMenu === menuItem.title}>
                  {menuItem.subMenu.map((subItem, subIndex) => (
                    <div key={subIndex}>
                      {subItem.subMenu ? (
                        <>
                          <MenuButton
                            title={subItem.title}
                            icon={subItem.icon}
                            isOpen={openSubMenu === subItem.title}
                            onClick={() => setOpenSubMenu(openSubMenu === subItem.title ? null : subItem.title)}
                            level={2}
                          />
                          <Accordion isOpen={openSubMenu === subItem.title}>
                            {subItem.subMenu.map((subSubItem, subSubIndex) => (
                              <MenuLink 
                                key={subSubIndex} 
                                href={subSubItem.link} 
                                isActive={isActive(subSubItem.link)}
                                title={subSubItem.title}
                                level={3}
                                target={allExternalLinks ? "_blank" : undefined}
                                onClose={onClose}
                              />
                            ))}
                          </Accordion>
                        </>
                      ) : (
                        <MenuLink 
                          href={subItem.link || "#"} 
                          isActive={isActive(subItem.link || "")}
                          icon={subItem.icon}
                          title={subItem.title}
                          level={2}
                          target={subItem.target || (allExternalLinks ? "_blank" : undefined)}
                          onClose={onClose}
                        />
                      )}
                    </div>
                  ))}
                </Accordion>
              </div>
            ) : (
              <Box className="pl-2 pr-3">
                <MenuLink 
                  href={menuItem.link || "#"} 
                  isActive={isActive(menuItem.link || "")}
                  icon={menuItem.icon}
                  title={menuItem.title}
                  target={allExternalLinks ? "_blank" : undefined}
                  onClose={onClose}
                />
              </Box>
            )}
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

interface SidebarProps {
  width: string;
  onClose: () => void;
}

export default function Sidebar({ width, onClose }: SidebarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { theme } = useTheme();

  const applicationMenuData: MenuItem[] = useMemo(() => [
    {
      title: "Dashboard",
      icon: <IconDashboard />,
      link: "/dashboard",
    },
    {
      title: "Product Management",
      icon: <IconMenu />,
      link: "#",
      subMenu: [
        { title: "Product List", link: "/product-management/product-list" },
        { title: "Categories", link: "/product-management/categories" },
      ],
    },
    {
      title: "Settings",
      icon: <IconSettings />,
      link: "#",
      subMenu: [
        { title: "Home", link: "/home-settings" },
        { title: "Sliders", link: "/sliders" },
        { title: "Shippings", link: "/shippings" },
        { title: "Delivery Partners", link: "/delivery-partners" },
        { title: "Policy", link: "#", subMenu: [
          { title: "Privacy", link: "/policy/privacy" },
          { title: "Warranty, Return, and Refund", link: "/policy/warranty-return-refund" },
          { title: "Shipping", link: "/policy/shipping" },
          { title: "Order Cancellation", link: "/policy/order-cancellation" },
        ]},
        { title: "FAQs", link: "/faqs" },
      ],
    },

  ], []);
  
  const uiPagesMenuData: MenuItem[] = useMemo(() => [], []);
  const documentationMenuData: MenuItem[] = useMemo(() => [], []);

  // Find active menu items based on current path and open parent menus
  useEffect(() => {
    let activeMainMenuTitle: string | null = null;
    let activeSubMenuTitle: string | null = null;
    let bestMatchFound = false;

    // Helper function to check activity, mirroring the logic used for styling
    const checkIsActive = (link: string): boolean => {
      if (!link || link === '#') return false;
      // Handle root path specifically
      if (link === '/') return pathname === link;
      // Check if current path starts with the link for other paths
      return pathname.startsWith(link);
    };

    // Combine both menu arrays for checking active items
    const allMenuData = [...applicationMenuData, ...uiPagesMenuData, ...documentationMenuData];
    
    // Iterate through menu data to find the active item and its parents
    for (const item of allMenuData) {
      // Check level 3 first (most specific)
      if (item.subMenu) {
        for (const subItem of item.subMenu) {
          if (subItem.subMenu) {
            for (const subSubItem of subItem.subMenu) {
              if (checkIsActive(subSubItem.link)) {
                activeMainMenuTitle = item.title;
                activeSubMenuTitle = subItem.title;
                bestMatchFound = true;
                break; // Exit subSubItem loop
              }
            }
          }
          if (bestMatchFound) break; // Exit subItem loop

          // Check level 2 if no level 3 found in this subItem's children
          if (checkIsActive(subItem.link)) {
            activeMainMenuTitle = item.title;
            activeSubMenuTitle = null; // Only main menu needs to be open
            bestMatchFound = true;
            break; // Exit subItem loop
          }
        }
      }
      if (bestMatchFound) break; // Exit item loop

      // Check level 1 if no level 2/3 found in this item's children
      if (checkIsActive(item.link)) {
        activeMainMenuTitle = null; // Top-level link is active, no accordion needs to be open
        activeSubMenuTitle = null;
        bestMatchFound = true;
        break; // Exit item loop
      }
    }

    // Update the open states based on the found active item
    setOpenMenu(activeMainMenuTitle);
    setOpenSubMenu(activeSubMenuTitle);

  }, [pathname, applicationMenuData, uiPagesMenuData, documentationMenuData]);


  // Helper function to check if a menu item link is active for styling
  const isActive = (link: string): boolean => {
    if (!link || link === '#') return false;
    // Handle the base case where link is '/' separately
    if (link === '/') {
      return pathname === link;
    }
    // Check if the current pathname starts with the link for nested routes
    return pathname.startsWith(link);
  };

  return (
    <Box
      position="fixed"
      top="0"
      className="border-r z-20"
      style={{
        backgroundColor: 'var(--color-panel-solid)',
        borderRightColor: 'var(--gray-3)',
        width: width
      }}
    >
      <Flex justify="between" align="center" px="2" py="5">
        <Flex justify="center" className="flex-1">
          <Link href="/">
            <Image src={'/images/logo.png'} alt="Logo" width={100} height={15} />
          </Link>
        </Flex>
        <div className="lg:hidden">
          <IconButton variant="ghost" color="gray" onClick={onClose}>
            <X />
          </IconButton>
        </div>
      </Flex>
      <ScrollArea scrollbars="vertical" style={{height: 'calc(100vh - 64px)'}} className="pb-8"> 
        <Box className="flex flex-col" style={{minHeight: "calc(100vh - 100px)"}}>
          <Box className="flex-1">
            {/* Application Menu Group */}
            <MenuGroup 
              title="Application" 
              menuData={applicationMenuData} 
              openMenu={openMenu} 
              setOpenMenu={setOpenMenu} 
              openSubMenu={openSubMenu} 
              setOpenSubMenu={setOpenSubMenu} 
              isActive={isActive}
              onClose={onClose}
            />
            
            </Box>
        </Box>
      </ScrollArea>
    </Box>
  );
}
