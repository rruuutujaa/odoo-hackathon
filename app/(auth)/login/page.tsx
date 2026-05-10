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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, PlaneTakeoff } from "lucide-react";

export const dynamic = "force-dynamic";

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
  } = useForm<LoginInput>({
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
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-white">
        <CardHeader className="space-y-2 text-center pt-8 pb-4">
          <div className="flex justify-center mb-2 text-[#FF6B35]">
            <PlaneTakeoff size={40} strokeWidth={2.5} />
          </div>
          <CardTitle className="text-3xl font-black text-[#1A1F3C]">Traveloop</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Welcome back! Log in to continue your adventure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6 rounded-xl bg-destructive/10 text-destructive border-none">
              <AlertDescription className="font-semibold">{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-[#1A1F3C]">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="alex@traveloop.com"
                {...register("email")}
                className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
              />
              {errors.email && (
                <p className="text-xs font-bold text-destructive mt-1 px-1">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-bold text-[#1A1F3C]">Password</Label>
                <Link href="#" className="text-xs font-bold text-[#FF6B35] hover:underline">Forgot?</Link>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
              />
              {errors.password && (
                <p className="text-xs font-bold text-destructive mt-1 px-1">{errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#FF6B35] hover:bg-[#E85A24] text-white font-black text-base rounded-xl transition-all shadow-lg shadow-[#FF6B35]/20 mt-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Log In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pb-8 justify-center">
          <p className="text-sm font-medium text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#FF6B35] font-black hover:underline ml-1">
              Create one for free
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
