'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel
} from "@/components/ui/sidebar"
import { DropdownAccountSwitcher } from "@/components/shared/DropdownAccountSwitcher";
import { Calendar, House, Contact, Receipt, GraduationCap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";


export function UserSidebar() {

  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const projects = [
    {
      name: "Dashboard",
      url: "/user/dashboard",
      icon: House,
    },
    {
      name: "Students",
      url: "/user/students",
      icon: GraduationCap ,
    },
    {
      name: "Schedules",
      url: "/user/schedules",
      icon: Calendar,
    },
    {
      name: "Coaches",
      url: "/user/coaches",
      icon: Contact,
    },
    {
      name: "Payments",
      url: "/user/payments",
      icon: Receipt,
    },
  ];

  return (
  <Sidebar>

    <SidebarHeader className="bg-gray-800 text-white p-4">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Image
              src="/logo.png"
              alt="Taekwondo Studio Logo"
              width={32}
              height={32}
            />
            <span className="ml-2 font-bold">Taekwondo Studio</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent className="bg-gray-900 text-white p-4">
    <SidebarMenu>
      {projects.map((project) => (
        <SidebarMenuItem key={project.name}>
          <SidebarMenuButton asChild>
            <a href={project.url}>
              <project.icon />
              <span>{project.name}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
    </SidebarContent>

    <SidebarFooter className="bg-gray-800 text-white p-4 :hover:bg-gray-700">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <DropdownAccountSwitcher />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

  </Sidebar>
  )
}