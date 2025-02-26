"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronDown, PanelLeft } from "lucide-react";

export function CustomTrigger() {
  const { toggleSidebar, open } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {open ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  Select Workspace
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Acme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Acme Corp.</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <SidebarMenuAction onClick={toggleSidebar}>
              <PanelLeft />
              <span className="sr-only">Toggle Sidebar</span>
            </SidebarMenuAction>
          </>
        ) : (
          <SidebarMenuButton onClick={toggleSidebar}>
            <PanelLeft />
            <span className="sr-only">Toggle Sidebar</span>
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
