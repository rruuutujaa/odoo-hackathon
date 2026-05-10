import { Search, Bell, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-8">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search destinations, activities..." 
          className="pl-10 bg-muted/50 border-none h-9 focus-visible:ring-1" 
        />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">Alex Smith</p>
            <p className="text-xs text-muted-foreground">Explorer</p>
          </div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
