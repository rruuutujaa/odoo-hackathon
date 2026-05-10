"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getProfile, updateProfile, getTrips } from "@/lib/supabase/queries";
import { uploadAvatar, getPublicUrl } from "@/lib/supabase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Camera, MapPin, Mail, Phone, Globe, Edit2, Save, X } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const p = await getProfile(user.id);
      const t = await getTrips(user.id);
      setProfile(p);
      setTrips(t);
      setFormData(p);
    }
    setLoading(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      try {
        const file = e.target.files[0];
        const path = await uploadAvatar(file, profile.id);
        const url = getPublicUrl("avatars", path);
        
        await updateProfile(profile.id, { photo_url: url });
        setProfile({ ...profile, photo_url: url });
      } catch (error) {
        console.error(error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(profile.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        city: formData.city,
        country: formData.country,
        bio: formData.bio
      });
      setProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const preplannedCount = trips.filter(t => t.status === 'upcoming').length;
  const previousCount = trips.filter(t => t.status === 'completed').length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Profile Header Card */}
      <Card className="overflow-hidden border-none shadow-lg rounded-[24px]">
        <div className="h-32 bg-gradient-to-r from-[#1A1F3C] to-primary" />
        <CardContent className="relative pt-0 px-8">
          <div className="flex flex-col md:flex-row items-end gap-6 -mt-12 mb-6">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={profile.photo_url || ""} />
                <AvatarFallback className="text-3xl bg-muted">{profile.first_name[0]}</AvatarFallback>
              </Avatar>
              <label className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold text-[#1A1F3C]">{profile.first_name} {profile.last_name}</h1>
              <p className="text-muted-foreground flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {profile.city}, {profile.country}
              </p>
            </div>
            <div className="pb-2">
              {editing ? (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditing(false)} className="rounded-[10px]">
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={saving} className="bg-[#FF6B35] hover:bg-[#E85A24] rounded-[10px]">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setEditing(true)} className="bg-primary hover:bg-primary/90 rounded-[10px]">
                  <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t">
            <div className="space-y-4">
              <h3 className="font-bold text-[#1A1F3C]">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  {editing ? (
                    <Input size={1} value={formData.phone || ""} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-8 py-0" />
                  ) : (
                    <span>{profile.phone || "No phone added"}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="h-4 w-4 text-primary" />
                  {editing ? (
                    <div className="flex gap-1">
                      <Input value={formData.city || ""} onChange={e => setFormData({...formData, city: e.target.value})} className="h-8 py-0" />
                      <Input value={formData.country || ""} onChange={e => setFormData({...formData, country: e.target.value})} className="h-8 py-0" />
                    </div>
                  ) : (
                    <span>{profile.city}, {profile.country}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <h3 className="font-bold text-[#1A1F3C]">About Me</h3>
              {editing ? (
                <textarea 
                  className="w-full rounded-[12px] border bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  rows={4}
                  value={formData.bio || ""}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  placeholder="Tell us about your travel style..."
                />
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {profile.bio || "No bio added yet. Tell other travelers about yourself!"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="rounded-[20px] border-none shadow-md bg-[#1A1F3C] text-white">
          <CardContent className="pt-6">
            <div className="text-4xl font-black mb-1">{preplannedCount}</div>
            <div className="text-sm opacity-80 uppercase tracking-wider font-bold">Preplanned Trips</div>
          </CardContent>
        </Card>
        <Card className="rounded-[20px] border-none shadow-md bg-[#FF6B35] text-white">
          <CardContent className="pt-6">
            <div className="text-4xl font-black mb-1">{previousCount}</div>
            <div className="text-sm opacity-80 uppercase tracking-wider font-bold">Previous Trips</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
