"use client";

import { useSession } from "next-auth/react";
import { updateInvoiceStatus } from "@/lib/actions/expenses";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Receipt, 
  ArrowLeft, 
  Download, 
  Share2, 
  CheckCircle2, 
  Wallet,
  PlaneTakeoff,
  Calendar,
  Users,
  Loader2,
  MapPin,
  Activity
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ExpenseForm } from "./components/ExpenseForm";

export default function InvoicePageClient({ trip, summary, id }: { trip: any, summary: any, id: string }) {
  const [isUpdating, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const primaryColor: [number, number, number] = [255, 92, 0]; // #FF5C00

    // Header
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("TRAVELOOP", 20, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("MISSION INTEL REPORT", 140, 25);

    // Trip Details
    doc.setTextColor(10, 10, 10);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(trip.title.toUpperCase(), 20, 55);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Traveler: ${trip.user.firstName} ${trip.user.lastName}`, 20, 65);
    doc.text(`Timeline: ${format(new Date(trip.startDate), "MMMM dd")} - ${format(new Date(trip.endDate), "MMMM dd, yyyy")}`, 20, 72);
    doc.text(`Status: ${trip.status}`, 140, 65);
    doc.text(`Base Budget: $${trip.totalBudget}`, 140, 72);

    // Stops Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("ITINERARY LOG", 20, 90);
    
    const stopData = trip.stops.map((stop: any, idx: number) => [
      `STEP ${idx + 1}`,
      stop.city,
      stop.country,
      format(new Date(stop.startDate), "MMM dd"),
      `$${stop.budget}`
    ]);

    autoTable(doc, {
      startY: 95,
      head: [['Index', 'City', 'Country', 'Arrival', 'Allocation']],
      body: stopData,
      theme: 'striped',
      headStyles: { fillColor: [10, 10, 10] }
    });

    // Expenses Section
    const nextY = (doc as any).lastAutoTable.finalY + 15;
    doc.text("FISCAL LEDGER", 20, nextY);
    
    const expenseData = trip.expenses.map((exp: any) => [
      exp.description,
      exp.category,
      exp.quantity,
      `$${exp.unitCost}`,
      `$${exp.amount}`
    ]);

    autoTable(doc, {
      startY: nextY + 5,
      head: [['Description', 'Category', 'Qty', 'Unit Cost', 'Amount']],
      body: expenseData,
      theme: 'grid',
      headStyles: { fillColor: primaryColor }
    });

    // Summary
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setDrawColor(200, 200, 200);
    doc.line(120, finalY - 10, 190, finalY - 10);
    
    doc.setFontSize(12);
    doc.text("SUBTOTAL:", 120, finalY);
    doc.text(`$${summary.subtotal.toLocaleString()}`, 160, finalY);
    
    doc.text("VAT (5%):", 120, finalY + 8);
    doc.text(`$${summary.tax.toLocaleString()}`, 160, finalY + 8);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("GRAND TOTAL:", 120, finalY + 18);
    doc.text(`$${summary.grandTotal.toLocaleString()}`, 160, finalY + 18);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("CONFIDENTIAL TRAVELOOP DOCUMENT - SYSTEM GENERATED", 70, 285);
    
    doc.save(`Traveloop-Report-${trip.title.replace(/\s+/g, '-')}.pdf`);
    toast({ title: "Report Generated", description: "Your comprehensive trip PDF is ready." });
  };

  const handleMarkPaid = async () => {
    setIsSubmitting(true);
    try {
      await updateInvoiceStatus(trip.invoice?.id || '', "PAID");
      toast({ title: "Status Updated", description: "Invoice marked as paid." });
      window.location.reload();
    } catch (e) {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not update invoice status." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <Link href={`/trips/${id}`} className="flex items-center gap-3 text-foreground/40 hover:text-primary transition-all font-black text-[10px] uppercase tracking-[0.4em]">
          <ArrowLeft size={14} /> Mission Intel
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-6xl font-display font-black text-[#1A1F3C] tracking-tighter">Fiscal Ledger.</h1>
            <p className="text-muted-foreground font-medium mt-2 text-lg">Systematic breakdown of expedition resource allocation.</p>
          </div>
          <div className="flex items-center gap-4">
            <ExpenseForm tripId={id} onSuccess={() => window.location.reload()} />
            <Button variant="outline" onClick={handleExportPDF} className="rounded-none border-foreground/10 font-black uppercase tracking-widest text-[10px] hover:bg-foreground hover:text-background h-12 px-8 transition-all">
              <Download className="mr-2 h-4 w-4" /> Export Intel
            </Button>
            {trip.invoice?.paymentStatus !== "PAID" && (
              <Button onClick={handleMarkPaid} disabled={isUpdating} className="bg-[#1A1F3C] hover:bg-black text-white rounded-none h-12 px-8 font-black uppercase tracking-widest text-[10px] shadow-none">
                {isUpdating ? <Loader2 className="animate-spin mr-2" size={16} /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                Seal Invoice
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-foreground/5 bg-background luxury-shadow">
        {[
          { label: "Grand Total", value: summary.grandTotal, color: "text-[#1A1F3C]" },
          { label: "Base Assets", value: summary.subtotal, color: "text-[#1A1F3C]" },
          { label: "Est. Taxation", value: summary.tax, color: "text-primary" },
          { label: "Budget Delta", value: summary.remainingBudget, color: summary.remainingBudget < 0 ? 'text-red-600' : 'text-green-600' }
        ].map((item, idx) => (
          <div key={item.label} className={`p-10 ${idx !== 3 ? 'border-r border-foreground/5' : ''}`}>
            <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] mb-4">{item.label}</p>
            <p className={`text-4xl font-display ${item.color}`}>${item.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-8 space-y-12">
          {/* Detailed Ledger Card */}
          <Card className="rounded-none border border-foreground/5 bg-white shadow-none">
            <CardHeader className="p-12 border-b border-foreground/5 bg-foreground/[0.01]">
              <div className="flex justify-between items-start">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-primary font-black text-2xl italic tracking-tighter">
                    <PlaneTakeoff /> Traveloop.
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-display text-[#1A1F3C]">Mission Invoice</p>
                    <p className="text-foreground/30 font-black text-[10px] uppercase tracking-[0.4em]">#{trip.invoice?.invoiceNumber || `TRP-${trip.id.substring(0, 8)}`}</p>
                  </div>
                </div>
                <div className="text-right space-y-4">
                  <Badge className={`rounded-none px-4 py-1.5 font-black text-[10px] tracking-widest ${trip.invoice?.paymentStatus === 'PAID' ? "bg-green-600 text-white" : "bg-primary text-white"}`}>
                    {trip.invoice?.paymentStatus || 'PENDING'}
                  </Badge>
                  <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">{format(new Date(), "MMMM dd, yyyy")}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-12">
              <div className="grid grid-cols-2 gap-20 mb-16">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.5em]">Primary Agent</p>
                  <div className="space-y-1">
                    <p className="text-xl font-display text-[#1A1F3C]">{trip.user.firstName} {trip.user.lastName}</p>
                    <p className="text-sm text-muted-foreground font-medium">{trip.user.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.5em]">Expedition Data</p>
                  <div className="space-y-1">
                    <p className="text-xl font-display text-[#1A1F3C]">{trip.title}</p>
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                      <Calendar size={14} className="text-primary" /> {format(new Date(trip.startDate), "MMM dd")} - {format(new Date(trip.endDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.5em]">Itemized Ledger</p>
                <div className="space-y-0 divide-y divide-foreground/5 border-y border-foreground/5">
                  {trip.expenses.map((expense: any) => (
                    <div key={expense.id} className="flex items-center justify-between py-8 group hover:bg-muted/10 transition-colors px-4">
                      <div className="flex items-center gap-6">
                        <div className="p-3 rounded-none bg-foreground/[0.03] text-foreground/20 group-hover:bg-primary group-hover:text-white transition-all">
                          <Receipt size={24} strokeWidth={1} />
                        </div>
                        <div>
                          <p className="text-xl font-display text-[#1A1F3C]">{expense.description}</p>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{expense.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-display text-[#1A1F3C]">${expense.amount.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{expense.quantity} units @ ${expense.unitCost}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-20 space-y-4 pt-10 border-t-4 border-foreground border-double max-w-sm ml-auto text-right">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-black text-foreground/30 uppercase tracking-[0.3em]">Subtotal</span>
                  <span className="text-xl font-display text-[#1A1F3C]">${summary.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-black text-foreground/30 uppercase tracking-[0.3em]">VAT (5%)</span>
                  <span className="text-xl font-display text-primary">${summary.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-6">
                  <span className="font-black text-[#1A1F3C] uppercase tracking-[0.5em] text-xs">Total Fiscal Value</span>
                  <span className="text-4xl font-display text-[#1A1F3C]">${summary.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-12 bg-foreground/[0.01] border-t border-foreground/5 flex justify-between items-center italic">
              <p className="text-[9px] font-bold text-foreground/20 max-w-xs leading-relaxed uppercase tracking-widest">
                Automated Transaction verification complete. Traveloop Systems Node 04-10.
              </p>
              <CheckCircle2 size={32} strokeWidth={1} className="text-foreground/5" />
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-16">
           <section className="space-y-8">
            <h2 className="text-3xl font-display flex items-center gap-3">
              <Wallet className="h-6 w-6 text-primary" />
              Resource Allocation.
            </h2>
            <div className="space-y-6">
              {Object.entries(summary.byCategory).map(([cat, amount]: [string, any]) => (
                <div key={cat} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.4em]">{cat}</span>
                    <span className="text-lg font-display text-[#1A1F3C]">${amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-foreground/[0.05] h-1 overflow-hidden">
                    <div 
                      className="h-full bg-foreground transition-all duration-1000" 
                      style={{ width: `${Math.min(100, (amount / summary.subtotal) * 100)}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Card className="rounded-none border-none bg-foreground text-background p-12 relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <h3 className="text-4xl font-display italic">Multi-Agent Protocol?</h3>
              <p className="text-lg font-medium text-background/60 leading-relaxed">
                Connect your travel partners and split expenses automatically with one click.
              </p>
              <Button size="lg" className="w-full bg-primary hover:bg-orange-600 text-white rounded-none font-black uppercase tracking-[0.3em] text-[10px] h-16 shadow-none transition-all">
                Upgrade to Tactical Pro
              </Button>
            </div>
            <Users className="absolute -right-8 -bottom-8 text-white/[0.03] group-hover:scale-125 transition-transform duration-1000" size={240} />
          </Card>
        </div>
      </div>
    </div>
  );
}
