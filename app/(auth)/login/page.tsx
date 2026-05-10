"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginSchema, LoginInput } from "@/lib/schemas/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

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
        setError("Invalid credentials. Access denied.");
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("System override failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-lg mx-auto space-y-12"
    >
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-[0.5em] text-[#FF5C00]">
           <ShieldCheck size={12} /> Secure Uplink
        </div>
        <h1 className="text-7xl font-display text-white tracking-tighter leading-none italic">
          Welcome <br />
          <span className="text-white not-italic opacity-40">Back.</span>
        </h1>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-center">
        <div className="relative group">
           <div className="absolute inset-0 bg-[#FF5C00] rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000" />
           <div className="w-56 h-56 rounded-full bg-white flex flex-col items-center justify-center p-8 shadow-[0_0_100px_rgba(255,92,0,0.1)] relative z-10 border border-white/20 transition-transform duration-700 hover:scale-105">
              <div className="w-24 h-24 bg-[#0A0A0A] rounded-full flex items-center justify-center mb-4">
                 <Globe size={48} className="text-[#FF5C00] animate-pulse" strokeWidth={1} />
              </div>
              <span className="text-2xl font-display font-black tracking-tighter text-[#0A0A0A] italic">Traveloop.</span>
              <p className="text-[7px] font-black text-black/40 uppercase tracking-[0.3em] mt-1">Personnel Node</p>
           </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        {error && (
          <div className="w-full py-4 border-l-4 border-[#FF5C00] bg-[#FF5C00]/5 px-6 mb-8">
            <p className="text-[#FF5C00] text-xs font-black uppercase tracking-widest">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div className="space-y-8">
            <div className="group border-b border-white/20 focus-within:border-[#FF5C00] transition-colors pb-2">
              <Label className="text-[#FF5C00] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Email Identity</Label>
              <Input 
                {...register("email")} 
                className="bg-transparent border-none h-12 text-xl font-display text-white p-0 rounded-none focus-visible:ring-0 placeholder:text-white/20" 
                placeholder="agent@traveloop.app" 
              />
              {errors.email && <p className="text-[10px] font-bold text-[#FF5C00] mt-2 uppercase tracking-widest">{errors.email.message as string}</p>}
            </div>

            <div className="group border-b border-white/20 focus-within:border-[#FF5C00] transition-colors pb-2">
              <div className="flex justify-between items-center mb-1">
                <Label className="text-[#FF5C00] text-[10px] font-black uppercase tracking-[0.4em]">Security Key</Label>
                <Link href="#" className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Recover</Link>
              </div>
              <Input 
                type="password" 
                {...register("password")} 
                className="bg-transparent border-none h-12 text-xl font-display text-white p-0 rounded-none focus-visible:ring-0 placeholder:text-white/20" 
                placeholder="••••••••" 
              />
              {errors.password && <p className="text-[10px] font-bold text-[#FF5C00] mt-2 uppercase tracking-widest">{errors.password.message as string}</p>}
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#FF5C00] hover:bg-white hover:text-black text-white h-16 font-black uppercase tracking-[0.4em] text-xs rounded-none transition-all duration-500 shadow-2xl shadow-orange-500/10 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <span className="flex items-center gap-3">
                   Initiate Session <ArrowRight size={16} />
                </span>
              )}
            </Button>
            
            <div className="text-center">
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
                New to the loop?{" "}
                <Link href="/register" className="text-white hover:text-[#FF5C00] transition-colors underline underline-offset-8 decoration-white/10 hover:decoration-[#FF5C00]">Register Personnel</Link>
              </p>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Decorative Signature */}
      <motion.div variants={itemVariants} className="pt-12 flex justify-center opacity-10">
         <div className="w-16 h-px bg-white" />
      </motion.div>
    </motion.div>
  );
}
