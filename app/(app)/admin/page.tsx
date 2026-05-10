import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminStats, getAllUsers, getPopularCities, getPopularActivities, getTripsByDay } from "@/lib/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  MapPin, 
  Plane, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck,
  User as UserIcon,
  Calendar
} from "lucide-react";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [stats, users, cities, activities, tripChart] = await Promise.all([
    getAdminStats(),
    getAllUsers(),
    getPopularCities(),
    getPopularActivities(),
    getTripsByDay()
  ]);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-[#1A1F3C] text-white p-3 rounded-2xl shadow-xl shadow-blue-900/20">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#1A1F3C]">Admin Control Center</h1>
            <p className="text-muted-foreground font-medium">Real-time system health and traveler analytics.</p>
          </div>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-muted flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span className="font-bold text-[#1A1F3C] text-sm uppercase tracking-widest">Systems Nominal</span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Total Trips", value: stats.totalTrips, icon: Plane, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Active Now", value: stats.activeTrips, icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
          { label: "Feed Posts", value: stats.communityPosts, icon: MessageSquare, color: "text-indigo-500", bg: "bg-indigo-50" }
        ].map((item) => (
          <Card key={item.label} className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                  <item.icon size={24} />
                </div>
                <Badge variant="outline" className="border-muted-foreground/10 text-[10px] font-bold">+12%</Badge>
              </div>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
              <h3 className="text-3xl font-black text-[#1A1F3C] mt-1">{item.value.toLocaleString()}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* User Management */}
        <div className="xl:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-[#1A1F3C] flex items-center gap-2">
            <Users className="h-5 w-5 text-[#FF6B35]" />
            Recent Traveler Registrations
          </h2>
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 border-b border-muted">
                    <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest">Traveler</th>
                    <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest">Location</th>
                    <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest">Trips</th>
                    <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/50">
                  {users.slice(0, 8).map((user) => (
                    <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-muted">
                            <AvatarFallback className="bg-orange-50 text-[#FF6B35] text-[10px] font-black uppercase">
                              {user.firstName[0]}{user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-sm text-[#1A1F3C]">{user.firstName} {user.lastName}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                        {user.city}, {user.country}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="bg-[#1A1F3C]/5 text-[#1A1F3C] rounded-lg px-2">
                          {user._count.trips}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Popular Stats */}
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[#1A1F3C] flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#FF6B35]" />
              Top Cities
            </h2>
            <div className="space-y-3">
              {cities.map((city, idx) => (
                <div key={city.name} className="flex items-center justify-between p-4 rounded-xl bg-white shadow-sm border border-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-muted-foreground w-4">{idx + 1}.</span>
                    <span className="font-bold text-sm text-[#1A1F3C]">{city.name}</span>
                  </div>
                  <Badge className="bg-[#1A1F3C] text-white">{city.count} Trips</Badge>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[#1A1F3C] flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#FF6B35]" />
              Top Activities
            </h2>
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act.name} className="flex items-center justify-between p-4 rounded-xl bg-white shadow-sm border border-muted/50">
                  <span className="font-bold text-sm text-[#1A1F3C] line-clamp-1">{act.name}</span>
                  <Badge variant="outline" className="border-primary/20 text-primary">{act.count} Picks</Badge>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
