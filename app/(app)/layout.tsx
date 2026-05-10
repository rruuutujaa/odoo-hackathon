"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background luxury-grid">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0 relative">
        {/* Topbar: Simplified and Integrated */}
        <div className="h-20 border-b border-foreground/5 flex items-center px-6 lg:px-12 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden mr-4 rounded-none hover:bg-foreground/5"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </Button>
          <div className="flex-1">
            <Topbar />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
