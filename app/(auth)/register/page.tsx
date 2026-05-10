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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, PlaneTakeoff, Globe, Phone, MapPin } from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      city: "",
      country: "",
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
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // Auto login after registration
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        callbackUrl: "/dashboard",
      });

    } catch (err) {
      setError("Failed to register. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl px-4 py-12">
      <Card className="border-none shadow-2xl rounded-2xl overflow-hidden bg-white">
        <CardHeader className="space-y-2 text-center pt-10 pb-6 border-b border-muted/50">
          <div className="flex justify-center mb-2 text-[#FF6B35]">
            <PlaneTakeoff size={48} strokeWidth={2.5} />
          </div>
          <CardTitle className="text-4xl font-black text-[#1A1F3C]">Start Journey</CardTitle>
          <CardDescription className="text-lg font-medium text-muted-foreground">
            Create your Traveloop account and start planning.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          {error && (
            <Alert variant="destructive" className="mb-8 rounded-xl bg-destructive/10 text-destructive border-none">
              <AlertDescription className="font-bold text-center py-1">{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="font-bold text-[#1A1F3C]">First Name</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  className="h-12 rounded-xl bg-muted/20 border-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
                />
                {errors.firstName && <p className="text-xs font-bold text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="font-bold text-[#1A1F3C]">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  className="h-12 rounded-xl bg-muted/20 border-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
                />
                {errors.lastName && <p className="text-xs font-bold text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-[#1A1F3C]">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="explorer@example.com"
                {...register("email")}
                className="h-12 rounded-xl bg-muted/20 border-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
              />
              {errors.email && <p className="text-xs font-bold text-destructive">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-bold flex items-center gap-1.5 text-[#1A1F3C]">
                  <Phone size={14} className="text-[#FF6B35]" /> Phone
                </Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  className="h-12 rounded-xl bg-muted/20 border-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="font-bold flex items-center gap-1.5 text-[#1A1F3C]">
                  <MapPin size={14} className="text-[#FF6B35]" /> City
                </Label>
                <Input
                  id="city"
                  {...register("city")}
                  className="h-12 rounded-xl bg-muted/20 border-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="font-bold flex items-center gap-1.5 text-[#1A1F3C]">
                  <Globe size={14} className="text-[#FF6B35]" /> Country
                </Label>
                <Input
                  id="country"
                  {...register("country")}
                  className="h-12 rounded-xl bg-muted/20 border-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold text-[#1A1F3C]">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="h-12 rounded-xl bg-muted/20 border-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
                />
                {errors.password && <p className="text-xs font-bold text-destructive">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-bold text-[#1A1F3C]">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  className="h-12 rounded-xl bg-muted/20 border-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
                />
                {errors.confirmPassword && <p className="text-xs font-bold text-destructive">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#FF6B35] hover:bg-[#E85A24] text-white font-black text-lg rounded-xl transition-all shadow-xl shadow-[#FF6B35]/25 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Create My Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pb-10 justify-center border-t border-muted/50 pt-8 mt-4 bg-muted/5">
          <p className="font-medium text-muted-foreground italic">
            Already have an account?{" "}
            <Link href="/login" className="text-[#FF6B35] font-black hover:underline not-italic ml-1">
              Log in here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
