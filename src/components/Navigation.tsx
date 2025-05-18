
import React from "react";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@/components/ui/menubar";
import { FileText, Download, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  onMenuClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onMenuClick }) => {
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Button onClick={onMenuClick} variant="ghost" size="icon" className="md:hidden">
            <Menu />
          </Button>
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">PDF Reorder Tool</h1>
        </div>
        
        <Menubar className="hidden md:flex">
          <MenubarMenu>
            <MenubarTrigger>Services</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>PDF Reordering</MenubarItem>
              <MenubarItem>PDF Compression</MenubarItem>
              <MenubarItem>PDF Merge</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Pricing</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Free Plan</MenubarItem>
              <MenubarItem>Premium Plan</MenubarItem>
              <MenubarItem>Enterprise</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Support</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Documentation</MenubarItem>
              <MenubarItem>Contact Us</MenubarItem>
              <MenubarItem>FAQ</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        
        <Button className="hidden md:flex" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Try Premium
        </Button>
      </div>
    </header>
  );
};

export default Navigation;
