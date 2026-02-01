// src/components/shared/Navigation.tsx
"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

type Role = "admin" | "coach" | "student";

const NAV = [
  { href: "/dashboard", label: "Dashboard", roles: ["admin", "coach"] as Role[] },
  { href: "/students", label: "Students", roles: ["admin", "coach"] as Role[] },
  { href: "/coaches", label: "Coaches", roles: ["admin"] as Role[] },
  { href: "/schedules", label: "Schedules", roles: ["admin", "coach"] as Role[] },
  { href: "/logout", label: "Logout", roles: ["admin", "coach", "student"] as Role[] },
];

export function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const items = NAV.filter((x) => x.roles.includes(user.role));

  const handleLogout = async () => {
    await logout();
    router.replace("/authentication/signin");
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              {item.href === "/logout" ? (
                <button onClick={handleLogout}>{item.label}</button>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
