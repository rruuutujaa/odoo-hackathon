"use client";

import { Search, Bell, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export function Topbar() {
  const { data: session } = useSession();
  
  const user = session?.user;
  const initials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "EX";

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md hidden md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search destinations, activities..." 
          className="pl-10 h-10 border-none bg-muted/40 rounded-none focus-visible:ring-1" 
        />
      </div>
      
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon" className="relative rounded-none">
          <Bell className="h-5 w-5" />
          <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>
        
        <div className="flex items-center gap-4 pl-4 border-l border-foreground/5 h-10">
          <div className="text-right hidden sm:block">
             <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 leading-none mb-1">Authenticated</p>
             <p className="text-xs font-black text-[#1A1F3C] leading-none">
               {user?.firstName} {user?.lastName}
             </p>
          </div>
          <Avatar className="h-8 w-8 rounded-none border border-foreground/10">
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback className="bg-foreground text-background text-[10px] font-black tracking-tighter">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
