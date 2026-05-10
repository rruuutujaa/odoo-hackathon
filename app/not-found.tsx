import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaneTakeoff, Compass, Map, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-[#FF6B35]/20 blur-[100px] rounded-full" />
        <PlaneTakeoff size={120} className="text-[#1A1F3C] relative z-10 animate-bounce" />
      </div>
      
      <h1 className="text-8xl font-black text-[#1A1F3C] mb-4 tracking-tighter">404</h1>
      <h2 className="text-3xl font-black text-[#FF6B35] mb-6 uppercase tracking-widest">Destination Not Found</h2>
      
      <p className="text-muted-foreground font-medium max-w-md mx-auto mb-12 text-lg">
        It looks like you've wandered off the map. This page doesn't exist in our global travel loop.
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button asChild className="bg-[#1A1F3C] hover:bg-black text-white rounded-xl h-14 px-10 font-black text-lg shadow-xl shadow-black/10">
          <Link href="/dashboard">
            <Home className="mr-2 h-5 w-5" /> Back to Base
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl h-14 px-10 font-black text-lg border-muted-foreground/20 bg-white shadow-sm">
          <Link href="/search">
            <Compass className="mr-2 h-5 w-5" /> Explore Destinies
          </Link>
        </Button>
      </div>

      <div className="mt-20 flex items-center gap-8 opacity-20 grayscale">
        <Map size={40} />
        <Compass size={40} />
      </div>
    </div>
  );
}
