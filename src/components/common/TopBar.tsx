"use client";
import { useState, useEffect, useContext } from "react";
import { DropdownMenu, Avatar, TextField, Flex, Text, Link as RadixLink, Button, Box, IconButton } from "@radix-ui/themes";
import { Bell, User, Search, Moon, Sun, Settings, LogOut, ChevronDown, Building, Store, Menu, Rocket } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { organization } from "@/data/CommonData";
import { AppOrganizationContext } from "@/contexts/AppOrganizationContext";

interface NotificationItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface TopBarProps {
  isScrolled: boolean;
  onMenuClick: () => void;
}

export default function TopBar({ isScrolled, onMenuClick }: TopBarProps) {
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const { activeEntity, setActiveEntity } = useContext(AppOrganizationContext);

  // Handle mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme toggle with localStorage update
  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Update localStorage and dispatch storage event for other components
    localStorage.setItem('theme', newTheme);
    window.dispatchEvent(new Event('storage'));
  };

  const notifications: NotificationItem[] = [
    {
      icon: <User size={14}/>,
      title: "New follower",
      description: "Jane Smith started following you"
    },
    {
      icon: <Rocket size={14} />,
      title: "System Update",
      description: "New features available"
    },
    {
      icon: <Bell size={14} />,
      title: "Reminder",
      description: "Team meeting in 30 minutes"
    }
  ];

  return (
    <Box
      className="sticky top-0 z-10 w-full transition-all duration-200"
      style={{
        backgroundColor: isScrolled ? 'var(--color-panel-solid)' : 'transparent',
        borderBottomWidth: isScrolled ? 1 : 0,
        borderBottomColor: 'var(--slate-4)',
      }}
    >
      <Box className="w-full px-4 py-3">
        <Flex justify="between" align="center" gap="4">
          <div className="lg:hidden">
            <IconButton variant="ghost" color="gray" onClick={onMenuClick}>
              <Menu />
            </IconButton>
          </div>
          
          {/* Search input on the left */}
          <div className="hidden lg:block">
            <TextField.Root placeholder="Search...">
              <TextField.Slot>
                <Search size={14} />
              </TextField.Slot>
            </TextField.Root>
          </div>
          
          {/* Right side items */}
          <Flex align="center" gap="4">
            {/* Branch dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button highContrast>
                  {activeEntity?.id === 'hq' ? <Building size={14} /> : <Store size={14} />}
                  {activeEntity?.name}
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {organization.map((entity) => (
                  <DropdownMenu.Item
                    key={entity.id}
                    onClick={() => {
                      setActiveEntity(entity);
                    }}
                  >
                    {entity.id === 'hq' ? <Building size={14} /> : <Store size={14} />}
                    <span>{entity.name}</span>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            {/* Dark mode switch */}
            <div className="flex items-center gap-2 cursor-pointer bg-gray-100 dark:bg-neutral-800 rounded-full p-2" role="button" onClick={handleThemeToggle}>
              {mounted && (theme === 'dark' ? <Sun size={18} className="text-gray-400 dark:text-neutral-600" /> : <Moon size={18} className="text-gray-400 dark:text-neutral-600" />)}
            </div>
            
            {/* Notification bell */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <span className="relative cursor-pointer bg-gray-100 dark:bg-neutral-800 rounded-full p-2">
                  <Bell size={18} className="text-gray-400 dark:text-neutral-600" />
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-2 h-2 flex items-center justify-center"></span>
                </span>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {notifications.map((notification, index) => (
                  <DropdownMenu.Item key={index} className="flex items-center gap-2 p-2 !cursor-pointer !h-auto group">
                    <span className="p-2 rounded-full bg-gray-100 text-gray-400 dark:bg-neutral-800 dark:text-neutral-600 dark:group-hover:bg-neutral-200">
                      {notification.icon}
                    </span>
                    <div className="flex flex-col">
                      <Text size="1" weight="medium">{notification.title}</Text>
                      <Text size="1" className="text-gray-500 dark:text-neutral-600 group-hover:text-white">{notification.description}</Text>
                    </div>
                  </DropdownMenu.Item>
                ))}
                <DropdownMenu.Separator />
                <div className="flex justify-center">
                  <RadixLink href="/" size="2">
                    View all notifications
                  </RadixLink>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            {/* User dropdown */}
            <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenu.Trigger>
                <Flex align="center" gap="1" className="bg-gray-100 dark:bg-neutral-800 px-3 py-2 rounded-md cursor-pointer" onClick={() => setDropdownOpen(!isDropdownOpen)}>
                  <Avatar 
                    radius="full" 
                    size="1" 
                    src="/images/user-avatar.jpg"
                    fallback="PB"
                  />
                  <div className="hidden lg:block">
                    <Text as="p" size="1" weight="bold" >Peter Bryan</Text>
                    <Text as="p" size="1" weight="medium" className="text-gray-400 dark:text-gray-400">HQ Admin</Text>
                  </div>
                  <DropdownMenu.TriggerIcon />
                </Flex>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User size={14} />
                    <span>Profile</span>
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <Link href="/settings" className="flex items-center gap-2"> 
                    <Settings size={14} />
                    <span>Settings</span>
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item className="flex items-center gap-2 text-red-500 dark:text-red-400 dark:hover:text-white !cursor-pointer" role="button" onClick={() => {}}>
                  <LogOut size={14} />
                  <span>Logout</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
} 