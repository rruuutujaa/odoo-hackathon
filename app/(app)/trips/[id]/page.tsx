import { notFound } from "next/navigation";
import Link from "next/link";
import { getTripById } from "@/lib/actions/trips";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Wallet, 
  Settings, 
  Share2, 
  ArrowLeft,
  LayoutGrid,
  Receipt,
  ClipboardList,
  NotebookPen
} from "lucide-react";
import { format } from "date-fns";

export default async function TripDetailsPage({ params }: { params: { id: string } }) {
  const trip = await getTripById(params.id);

  if (!trip) notFound();

  const statusColors = {
    ONGOING: "bg-green-500/10 text-green-600 border-green-200",
    UPCOMING: "bg-blue-500/10 text-blue-600 border-blue-200",
    COMPLETED: "bg-gray-500/10 text-gray-600 border-gray-200",
  };

  const actionCards = [
    { label: "Itinerary Builder", href: `/trips/${trip.id}/build`, icon: LayoutGrid, color: "text-orange-500", bg: "bg-orange-50", description: "Design your daily schedule and activities." },
    { label: "Packing Checklist", href: `/trips/${trip.id}/checklist`, icon: ClipboardList, color: "text-blue-500", bg: "bg-blue-50", description: "Stay organized with your travel essentials." },
    { label: "Trip Journal", href: `/trips/${trip.id}/notes`, icon: NotebookPen, color: "text-indigo-500", bg: "bg-indigo-50", description: "Capture memories and important notes." },
    { label: "Expenses & Billing", href: `/trips/${trip.id}/invoice`, icon: Receipt, color: "text-green-500", bg: "bg-green-50", description: "Track spending and generate invoices." },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/trips" className="flex items-center gap-2 text-muted-foreground hover:text-[#FF6B35] transition-colors font-bold text-sm">
          <ArrowLeft size={16} /> Back to My Trips
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-[#1A1F3C]">{trip.title}</h1>
              <Badge variant="outline" className={`rounded-full px-4 py-1 font-bold ${statusColors[trip.status]}`}>
                {trip.status}
              </Badge>
            </div>
            <p className="text-muted-foreground text-lg font-medium">{trip.description || "No description provided."}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-muted-foreground/20 font-bold hover:bg-muted/50">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button variant="outline" className="rounded-xl border-muted-foreground/20 font-bold hover:bg-muted/50">
              <Settings className="mr-2 h-4 w-4" /> Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm rounded-2xl bg-white p-6 flex items-center gap-5">
          <div className="p-4 rounded-xl bg-orange-50 text-[#FF6B35]">
            <Calendar size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Duration</p>
            <p className="text-lg font-black text-[#1A1F3C]">
              {format(new Date(trip.startDate), "MMM dd")} - {format(new Date(trip.endDate), "MMM dd, yyyy")}
            </p>
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl bg-white p-6 flex items-center gap-5">
          <div className="p-4 rounded-xl bg-blue-50 text-blue-500">
            <MapPin size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Destinations</p>
            <p className="text-lg font-black text-[#1A1F3C]">{trip.stops.length} Planned Stops</p>
          </div>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl bg-white p-6 flex items-center gap-5">
          <div className="p-4 rounded-xl bg-green-50 text-green-500">
            <Wallet size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Budget</p>
            <p className="text-lg font-black text-[#1A1F3C]">${trip.totalBudget.toLocaleString()}</p>
          </div>
        </Card>
      </div>

      {/* Management Sections */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#1A1F3C]">Trip Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actionCards.map((action) => (
            <Link key={action.label} href={action.href}>
              <Card className="group border-none shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 h-full border-b-4 border-transparent hover:border-[#FF6B35]">
                <CardContent className="p-8 space-y-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1A1F3C]">{action.label}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-medium">{action.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
