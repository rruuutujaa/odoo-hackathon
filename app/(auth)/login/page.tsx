"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema, LoginInput } from "@/lib/schemas/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-12 animate-in fade-in duration-1000">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-[#2D3F75] tracking-tighter">Welcome</h1>
        <p className="text-white text-lg font-medium">Log in to your Traveloop command center</p>
      </div>

      {error && (
        <div className="w-full py-4 border-y border-white flex items-center justify-center bg-red-500/10">
          <p className="text-white text-sm font-bold tracking-widest uppercase">{error}</p>
        </div>
      )}

      {/* Big Circular Logo mirroring the screenshot */}
      <div className="flex justify-center">
        <div className="w-72 h-72 rounded-full bg-white flex flex-col items-center justify-center p-10 shadow-2xl relative overflow-hidden group hover:scale-105 transition-transform duration-500">
           <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-36 h-32 bg-gradient-to-br from-blue-500 via-orange-500 to-green-500 rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                <Globe size={100} className="text-white" strokeWidth={1} />
              </div>
              <span className="text-4xl font-black text-[#1A1F3C] tracking-tighter mt-2">TRAVELOOP</span>
              <p className="text-[8px] font-bold text-[#1A1F3C]/60 uppercase tracking-[0.3em] text-center">Your Journey in One Loop</p>
           </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-10">
        <div className="space-y-6">
          <div className="border-b border-white/20 pb-2">
            <Label className="text-white text-xs font-black uppercase tracking-[0.2em] mb-2 block">Email Identity</Label>
            <Input 
              {...register("email")} 
              className="bg-transparent border-none h-10 text-lg p-0 rounded-none focus-visible:ring-0 placeholder:text-white/10" 
              placeholder="explorer@traveloop.app" 
            />
          </div>

          <div className="border-b border-white/20 pb-2">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-white text-xs font-black uppercase tracking-[0.2em]">Security Key</Label>
              <Link href="#" className="text-white/40 text-[10px] font-bold uppercase hover:text-[#FF6B35]">Recover</Link>
            </div>
            <Input 
              type="password" 
              {...register("password")} 
              className="bg-transparent border-none h-10 text-lg p-0 rounded-none focus-visible:ring-0 placeholder:text-white/10" 
              placeholder="••••••••" 
            />
          </div>
        </div>

        <div className="space-y-6">
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#FF6B35] hover:bg-[#E85A24] text-white h-14 font-black rounded-2xl text-lg shadow-2xl shadow-orange-500/20 active:scale-95 transition-all"
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Initiate Login"}
          </Button>
          
          <div className="text-center">
            <p className="text-white/60 text-sm font-medium">
              New to the loop?{" "}
              <Link href="/register" className="text-white font-black underline underline-offset-4 decoration-[#FF6B35]">Create Account</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
