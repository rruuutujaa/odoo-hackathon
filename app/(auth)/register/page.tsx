"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema, RegisterInput } from "@/lib/schemas/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterInput) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Database error saving new user");
        setLoading(false);
        return;
      }

      await signIn("credentials", {
        email: values.email,
        password: values.password,
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      setError("Database error saving new user");
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-1000">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-[#2D3F75] tracking-tight">Create an account</h1>
        <p className="text-white font-medium text-sm">Join Traveloop to start planning your adventures</p>
      </div>

      {error && (
        <div className="w-full py-2 border-y border-white flex items-center justify-start">
          <p className="text-white text-xs font-medium">{error}</p>
        </div>
      )}

      {/* Big Circular Logo mirroring the screenshot */}
      <div className="flex justify-center py-6">
        <div className="w-64 h-64 rounded-full bg-white flex flex-col items-center justify-center p-8 shadow-2xl relative overflow-hidden">
           <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 via-orange-400 to-green-400 rounded-full flex items-center justify-center shadow-inner">
                <Globe size={80} className="text-white" strokeWidth={1.5} />
              </div>
              <span className="text-4xl font-black text-[#1A1F3C] tracking-tighter mt-2">NEWSIFY</span>
              <p className="text-[8px] font-bold text-[#1A1F3C]/60 uppercase tracking-widest text-center">Your World in One Newsfeed</p>
           </div>
           {/* Replicating the user's reference logo style */}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-center">
           <label className="text-white text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:underline">
             Upload Profile Photo
             <input type="file" className="hidden" />
           </label>
        </div>

        <div className="grid grid-cols-2 gap-x-1 border-t border-white/20">
          <div className="pt-2">
            <Label className="text-white text-[10px] font-black uppercase tracking-widest mb-1 block">First Name</Label>
            <Input {...register("firstName")} className="bg-transparent border-none h-8 text-sm p-0 rounded-none focus-visible:ring-0 placeholder:text-white/20" placeholder="Parth" />
          </div>
          <div className="pt-2">
            <Label className="text-white text-[10px] font-black uppercase tracking-widest mb-1 block">Last Name</Label>
            <Input {...register("lastName")} className="bg-transparent border-none h-8 text-sm p-0 rounded-none focus-visible:ring-0 placeholder:text-white/20" placeholder="Upadhye" />
          </div>
        </div>

        <div className="border-t border-white/20 pt-2">
          <Label className="text-white text-[10px] font-black uppercase tracking-widest mb-1 block">Email</Label>
          <Input {...register("email")} className="bg-transparent border-none h-8 text-sm p-0 rounded-none focus-visible:ring-0 placeholder:text-white/20" placeholder="parth.upadhye.4@gmail.com" />
        </div>

        <div className="border-t border-white/20 pt-2">
          <Label className="text-white text-[10px] font-black uppercase tracking-widest mb-1 block">Phone (Optional)</Label>
          <Input {...register("phone")} className="bg-transparent border-none h-8 text-sm p-0 rounded-none focus-visible:ring-0 placeholder:text-white/20" placeholder="09511827732" />
        </div>

        <div className="grid grid-cols-2 gap-x-1 border-t border-white/20">
          <div className="pt-2">
            <Label className="text-white text-[10px] font-black uppercase tracking-widest mb-1 block">City</Label>
            <Input {...register("city")} className="bg-transparent border-none h-8 text-sm p-0 rounded-none focus-visible:ring-0 placeholder:text-white/20" placeholder="Nagpur" />
          </div>
          <div className="pt-2">
            <Label className="text-white text-[10px] font-black uppercase tracking-widest mb-1 block">Country</Label>
            <Input {...register("country")} className="bg-transparent border-none h-8 text-sm p-0 rounded-none focus-visible:ring-0 placeholder:text-white/20" placeholder="India" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-1 border-y border-white/20">
          <div className="py-2">
            <Label className="text-white text-[10px] font-black uppercase tracking-widest mb-1 block">Password</Label>
            <Input type="password" {...register("password")} className="bg-transparent border-none h-8 text-sm p-0 rounded-none focus-visible:ring-0 placeholder:text-white/20" placeholder="••••••••" />
          </div>
          <div className="py-2">
            <Label className="text-white text-[10px] font-black uppercase tracking-widest mb-1 block">Confirm Password</Label>
            <Input type="password" {...register("confirmPassword")} className="bg-transparent border-none h-8 text-sm p-0 rounded-none focus-visible:ring-0 placeholder:text-white/20" placeholder="••••••••" />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#FF6B35] hover:bg-[#E85A24] text-white h-10 font-bold rounded-xl text-sm"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register"}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-white text-xs font-medium">
          Already have an account?{" "}
          <Link href="/login" className="underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
