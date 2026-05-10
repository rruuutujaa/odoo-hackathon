import { notFound } from "next/navigation";
import { getTripById } from "@/lib/actions/trips";
import { getExpenseSummary } from "@/lib/actions/expenses";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Receipt, 
  ArrowLeft, 
  Download, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Wallet,
  PlaneTakeoff,
  Building2,
  Calendar,
  Users
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const trip = await getTripById(params.id);
  if (!trip) notFound();

  const summary = await getExpenseSummary(params.id);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href={`/trips/${params.id}`} className="flex items-center gap-2 text-muted-foreground hover:text-[#FF6B35] transition-colors font-bold text-sm">
          <ArrowLeft size={16} /> Back to Trip Details
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#1A1F3C]">Expenses & Billing</h1>
            <p className="text-muted-foreground font-medium mt-1">Detailed breakdown of your adventure spending.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-muted-foreground/20 font-bold hover:bg-muted/50 h-12">
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
            <Button className="bg-[#1A1F3C] hover:bg-black text-white rounded-xl h-12 px-6 font-bold">
              <Share2 className="mr-2 h-4 w-4" /> Send Invoice
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm rounded-2xl bg-white p-6">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Spent</p>
          <p className="text-3xl font-black text-[#1A1F3C]">${summary.grandTotal.toLocaleString()}</p>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl bg-white p-6">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Subtotal</p>
          <p className="text-3xl font-black text-[#1A1F3C]">${summary.subtotal.toLocaleString()}</p>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl bg-white p-6">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Estimated Tax</p>
          <p className="text-3xl font-black text-[#FF6B35]">${summary.tax.toLocaleString()}</p>
        </Card>
        <Card className={`border-none shadow-sm rounded-2xl p-6 ${summary.remainingBudget < 0 ? 'bg-red-50' : 'bg-green-50'}`}>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Remaining Budget</p>
          <p className={`text-3xl font-black ${summary.remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
            ${summary.remainingBudget.toLocaleString()}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Invoice Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white border-t-8 border-t-[#1A1F3C]">
            <CardHeader className="p-10 border-b border-muted/50 bg-muted/5">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#FF6B35] font-black text-xl italic">
                    <PlaneTakeoff /> Traveloop
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-black text-[#1A1F3C]">Trip Invoice</p>
                    <p className="text-muted-foreground font-medium text-sm">#{trip.invoice?.invoiceNumber || `TRP-${trip.id.substring(0, 8)}`}</p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Badge className={trip.invoice?.paymentStatus === 'PAID' ? "bg-green-500 text-white" : "bg-orange-500 text-white"}>
                    {trip.invoice?.paymentStatus || 'PENDING'}
                  </Badge>
                  <p className="text-xs font-bold text-muted-foreground uppercase">{format(new Date(), "MMMM dd, yyyy")}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10">
              <div className="grid grid-cols-2 gap-10 mb-12">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Traveler Details</p>
                  <p className="font-bold text-[#1A1F3C]">{trip.user.firstName} {trip.user.lastName}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{trip.user.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Trip Details</p>
                  <p className="font-bold text-[#1A1F3C]">{trip.title}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar size={12} /> {format(new Date(trip.startDate), "MMM dd")} - {format(new Date(trip.endDate), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Itemized Expenses</p>
                <div className="space-y-4">
                  {trip.expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between py-4 border-b border-muted/30 last:border-none">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-muted/30 text-muted-foreground">
                          <Receipt size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-[#1A1F3C]">{expense.description}</p>
                          <p className="text-xs font-medium text-muted-foreground uppercase">{expense.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-[#1A1F3C]">${expense.amount.toLocaleString()}</p>
                        <p className="text-[10px] font-medium text-muted-foreground">{expense.quantity} x ${expense.unitCost}</p>
                      </div>
                    </div>
                  ))}
                  {trip.expenses.length === 0 && (
                    <p className="text-center py-10 text-muted-foreground font-medium italic border-2 border-dashed rounded-2xl">
                      No expenses recorded yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-12 space-y-3 pt-8 border-t-2 border-muted border-dashed max-w-sm ml-auto">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-muted-foreground uppercase tracking-widest">Subtotal</span>
                  <span className="text-[#1A1F3C]">${summary.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-muted-foreground uppercase tracking-widest">VAT (5%)</span>
                  <span className="text-[#1A1F3C]">${summary.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-4">
                  <span className="text-[#1A1F3C]">Grand Total</span>
                  <span className="text-[#FF6B35]">${summary.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-10 bg-muted/5 border-t border-muted/50 flex justify-between">
              <p className="text-[10px] font-bold text-muted-foreground max-w-xs leading-relaxed uppercase">
                Generated automatically by Traveloop App. All rights reserved. 2026.
              </p>
              <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-tighter">
                <CheckCircle2 size={16} /> Verified Transaction
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Categories / Side Info */}
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[#1A1F3C] flex items-center gap-2">
              <Wallet className="h-5 w-5 text-[#FF6B35]" />
              Spending by Category
            </h2>
            <div className="space-y-3">
              {Object.entries(summary.byCategory).map(([cat, amount]: [string, any]) => (
                <div key={cat} className="p-5 rounded-2xl bg-white shadow-sm border border-muted">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">{cat}</span>
                    <span className="font-black text-[#1A1F3C]">${amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#1A1F3C]" 
                      style={{ width: `${Math.min(100, (amount / summary.subtotal) * 100)}%` }} 
                    />
                  </div>
                </div>
              ))}
              {Object.keys(summary.byCategory).length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-6 italic uppercase tracking-widest">No data available</p>
              )}
            </div>
          </section>

          <Card className="border-none shadow-sm rounded-2xl bg-[#FF6B35] text-white p-8 overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-4">Split with Friends?</h3>
              <p className="text-sm text-white/80 leading-relaxed font-medium mb-6">
                Connect your travel partners and split expenses automatically with one click.
              </p>
              <Button className="w-full bg-[#1A1F3C] hover:bg-black text-white rounded-xl font-black h-12">
                Upgrade to Pro
              </Button>
            </div>
            <Users className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-125 transition-transform duration-500" size={160} />
          </Card>
        </div>
      </div>
    </div>
  );
}
