"use client";

import { Button } from "./button";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  title?: string;
  description?: string;
  retry?: () => void;
}

export function ErrorState({ 
  title = "Something went wrong", 
  description = "We encountered an unexpected error while preparing your itinerary. Please try again.",
  retry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl shadow-sm border border-muted min-h-[400px]">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-6">
        <AlertCircle size={40} />
      </div>
      <h2 className="text-3xl font-black text-[#1A1F3C] mb-3 tracking-tight">{title}</h2>
      <p className="text-muted-foreground font-medium max-w-md mx-auto mb-10 leading-relaxed">
        {description}
      </p>
      
      <div className="flex items-center gap-4">
        {retry && (
          <Button onClick={retry} className="bg-[#1A1F3C] hover:bg-black text-white rounded-xl h-12 px-8 font-bold">
            <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        )}
        <Button asChild variant="outline" className="rounded-xl h-12 px-8 font-bold border-muted-foreground/20">
          <Link href="/dashboard">
            <Home className="mr-2 h-4 w-4" /> Back Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
