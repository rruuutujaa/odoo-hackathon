"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getTrips } from "@/lib/actions/trips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Camera, MapPin, Mail, Globe, ArrowRight, Settings, Shield, User } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  
  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const t = await getTrips(session!.user.id);
      setTrips(t);
      setProfile(session?.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-[#FF6B35]" />
      </div>
    );
  }

  const preplannedCount = trips.filter(t => t.status === 'UPCOMING').length;
  const previousCount = trips.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="animate-in fade-in duration-1000 min-h-screen">
      {/* Editorial Profile Header */}
      <section className="section-padding bg-foreground text-background relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF6B35]/10 rounded-full blur-[150px] -mr-64 -mt-64" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-20 items-end">
          <div className="lg:col-span-8 space-y-12">
             <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#FF6B35]">Identity Profile</p>
                <h1 className="text-8xl md:text-9xl font-display leading-tight tracking-tighter">
                   Agent <br />
                   <span className="text-[#FF6B35] italic capitalize">{profile?.firstName || 'Explorer'}</span>.
                </h1>
             </div>
             <div className="flex flex-wrap gap-12 border-l border-background/10 pl-8">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-background/40">Status</p>
                   <p className="text-2xl font-display text-white">Authenticated</p>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-background/40">Role</p>
                   <p className="text-2xl font-display text-white capitalize">{profile?.role || 'USER'}</p>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-background/40">Affiliation</p>
                   <p className="text-2xl font-display text-white">Traveloop Global</p>
                </div>
             </div>
          </div>
          <div className="lg:col-span-4 flex justify-end">
             <div className="relative group">
                <div className="absolute inset-0 bg-[#FF6B35] rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="w-64 h-64 rounded-full border-4 border-[#FF6B35]/30 overflow-hidden bg-white/5 relative flex items-center justify-center p-2 backdrop-blur-2xl">
                   <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-display text-8xl text-black">
                      {profile?.firstName?.[0]}
                   </div>
                   <button className="absolute bottom-4 right-4 bg-[#FF6B35] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform">
                      <Camera size={24} />
                   </button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Profile Analytics / Stats */}
      <section className="section-padding grid grid-cols-1 lg:grid-cols-12 gap-20">
         <div className="lg:col-span-4 space-y-12">
            <h2 className="text-4xl font-display tracking-tight border-b border-foreground/5 pb-6 italic">Personnel Data.</h2>
            <div className="space-y-8">
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Email Identity</Label>
                  <p className="text-2xl font-medium border-b border-foreground/5 pb-2">{profile?.email}</p>
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Coordinates</Label>
                  <p className="text-2xl font-medium border-b border-foreground/5 pb-2">Global / Distributed</p>
               </div>
               <Button size="lg" className="rounded-full px-10 bg-foreground text-background hover:bg-[#FF6B35] hover:text-white font-black uppercase tracking-widest text-[10px] h-14">
                  <Settings className="mr-2 h-4 w-4" /> System Preferences
               </Button>
            </div>
         </div>

         <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <Card className="rounded-[40px] border border-foreground/5 bg-foreground text-background p-12 overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                  <Shield size={120} strokeWidth={1} />
               </div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-background/40 mb-2">Planned Missions</h3>
               <p className="text-9xl font-display leading-none">{preplannedCount.toString().padStart(2, '0')}</p>
               <p className="text-sm font-bold uppercase tracking-widest mt-8 text-background/60 italic leading-relaxed">
                  Active loops awaiting execution in the global grid.
               </p>
            </Card>

            <Card className="rounded-[40px] border border-[#FF6B35]/20 bg-white p-12 overflow-hidden relative group shadow-2xl">
               <div className="absolute top-0 right-0 p-8 text-[#FF6B35] opacity-5 group-hover:scale-125 transition-transform duration-1000">
                  <MapPin size={120} strokeWidth={1} />
               </div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground mb-2">Secured Archives</h3>
               <p className="text-9xl font-display leading-none text-[#FF6B35]">{previousCount.toString().padStart(2, '0')}</p>
               <p className="text-sm font-bold uppercase tracking-widest mt-8 text-muted-foreground italic leading-relaxed">
                  Successful expeditions logged and data-secured.
               </p>
            </Card>
         </div>
      </section>

      {/* Unique Detail: Luxury Signature */}
      <section className="section-padding flex flex-col items-center justify-center opacity-10 py-40">
         <div className="w-px h-40 bg-foreground mb-12" />
         <p className="text-4xl font-display tracking-widest italic select-none">Traveloop Personnel Command</p>
      </section>
    </div>
  );
}
