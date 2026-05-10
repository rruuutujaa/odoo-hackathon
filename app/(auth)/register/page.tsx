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
import { Globe, Loader2, Sparkles, UserPlus } from "lucide-react";
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
        setError(data.error || "Personnel logging failed.");
        setLoading(false);
        return;
      }

      await signIn("credentials", {
        email: values.email,
        password: values.password,
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      setError("Strategic error saving data.");
      setLoading(false);
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto space-y-12 pb-20"
    >
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-[0.5em] text-[#FF5C00]">
           <UserPlus size={12} /> New Onboarding
        </div>
        <h1 className="text-7xl font-display text-white tracking-tighter leading-none italic">
          Bespoke <br />
          <span className="text-white not-italic opacity-40">Identity.</span>
        </h1>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-center">
        <div className="relative group">
           <div className="absolute inset-0 bg-[#FF5C00] rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000" />
           <div className="w-48 h-48 rounded-full bg-white flex flex-col items-center justify-center p-8 shadow-[0_0_100px_rgba(255,92,0,0.1)] relative z-10 border border-white/20 transition-transform duration-700 hover:scale-105">
              <div className="w-16 h-16 bg-[#0A0A0A] rounded-full flex items-center justify-center mb-2">
                 <Sparkles size={24} className="text-[#FF5C00]" strokeWidth={1} />
              </div>
              <span className="text-xl font-display font-black tracking-tighter text-[#0A0A0A] italic">Traveloop.</span>
              <p className="text-[6px] font-black text-black/40 uppercase tracking-[0.3em]">System V.2</p>
           </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        {error && (
          <div className="w-full py-4 border-l-4 border-[#FF5C00] bg-[#FF5C00]/5 px-6 mb-8">
            <p className="text-[#FF5C00] text-xs font-black uppercase tracking-widest">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="group border-b border-white/20 focus-within:border-[#FF5C00] transition-colors pb-2">
              <Label className="text-[#FF5C00] text-[9px] font-black uppercase tracking-[0.4em] mb-1 block">Forename</Label>
              <Input {...register("firstName")} className="bg-transparent border-none h-10 text-lg font-display text-white p-0 rounded-none focus-visible:ring-0 placeholder:text-white/20" placeholder="PARTH" />
              {errors.firstName && <p className="text-[9px] font-bold text-[#FF5C00] mt-2 uppercase">{errors.firstName.message as string}</p>}
            </div>
            <div className="group border-b border-white/20 focus-within:border-[#FF5C00] transition-colors pb-2">
              <Label className="text-[#FF5C00] text-[9px] font-black uppercase tracking-[0.4em] mb-1 block">Surname</Label>
              <Input {...register("lastName")} className="bg-transparent border-none h-10 text-lg font-display text-white p-0 rounded-none focus-visible:ring-0 placeholder:text-white/20" placeholder="UPADHYE" />
              {errors.lastName && <p className="text-[9px] font-bold text-[#FF5C00] mt-2 uppercase">{errors.lastName.message as string}</p>}
            </div>
          </div>

          <div className="group border-b border-white/20 focus-within:border-[#FF5C00] transition-colors pb-2">
            <Label className="text-[#FF5C00] text-[9px] font-black uppercase tracking-[0.4em] mb-1 block">Email Communication</Label>
            <Input {...register("email")} className="bg-transparent border-none h-10 text-lg font-display text-white p-0 rounded-none focus-visible:ring-0 placeholder:text-white/20" placeholder="AGENT@TRAVELOOP.APP" />
            {errors.email && <p className="text-[9px] font-bold text-[#FF5C00] mt-2 uppercase">{errors.email.message as string}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="group border-b border-white/20 focus-within:border-[#FF5C00] transition-colors pb-2">
              <Label className="text-[#FF5C00] text-[9px] font-black uppercase tracking-[0.4em] mb-1 block">Secret Phrase</Label>
              <Input type="password" {...register("password")} className="bg-transparent border-none h-10 text-lg font-display text-white p-0 rounded-none focus-visible:ring-0 placeholder:text-white/20" placeholder="••••••••" />
              {errors.password && <p className="text-[9px] font-bold text-[#FF5C00] mt-2 uppercase">{errors.password.message as string}</p>}
            </div>
            <div className="group border-b border-white/20 focus-within:border-[#FF5C00] transition-colors pb-2">
              <Label className="text-[#FF5C00] text-[9px] font-black uppercase tracking-[0.4em] mb-1 block">Verify Phrase</Label>
              <Input type="password" {...register("confirmPassword")} className="bg-transparent border-none h-10 text-lg font-display text-white p-0 rounded-none focus-visible:ring-0 placeholder:text-white/20" placeholder="••••••••" />
              {errors.confirmPassword && <p className="text-[9px] font-bold text-[#FF5C00] mt-2 uppercase">{errors.confirmPassword.message as string}</p>}
            </div>
          </div>

          <div className="space-y-8 pt-6">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#FF5C00] hover:bg-white hover:text-black text-white h-16 font-black uppercase tracking-[0.4em] text-xs rounded-none transition-all duration-500 shadow-2xl shadow-orange-500/10 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authenticate & Initiate"}
            </Button>
            
            <div className="text-center">
              <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest">
                Already part of the loop?{" "}
                <Link href="/login" className="text-white hover:text-[#FF5C00] transition-colors underline underline-offset-8 decoration-white/10 hover:decoration-[#FF5C00]">Initiate Login</Link>
              </p>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
