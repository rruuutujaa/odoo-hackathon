"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, ExpenseInput } from "@/lib/schemas/trips";
import { addExpense } from "@/lib/actions/expenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ExpenseForm({ tripId, onSuccess }: { tripId: string, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      tripId,
      category: "OTHER",
      description: "",
      quantity: 1,
      unitCost: 0,
    },
  });

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      await addExpense(values);
      toast({ title: "Expense Added", description: "The transaction has been recorded." });
      setOpen(false);
      reset();
      onSuccess();
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Failed to add expense." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#FF6B35] hover:bg-[#E85A24] text-white rounded-xl h-12 px-6 font-bold shadow-lg shadow-orange-500/20">
          <Plus className="mr-2 h-5 w-5" /> Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl border-none shadow-2xl p-8 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-[#1A1F3C]">New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Category</Label>
            <select 
              {...register("category")}
              className="w-full h-12 rounded-xl bg-muted/40 px-4 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            >
              <option value="HOTEL">Hotel / Accommodation</option>
              <option value="TRAVEL">Travel / Transport</option>
              <option value="FOOD">Food & Dining</option>
              <option value="ACTIVITY">Activities</option>
              <option value="OTHER">Other Expenses</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Description</Label>
            <Input {...register("description")} placeholder="e.g. Flight to Paris" />
            {errors.description && <p className="text-xs font-bold text-destructive">{errors.description.message as string}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Quantity</Label>
              <Input type="number" {...register("quantity")} />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Unit Cost ($)</Label>
              <Input type="number" {...register("unitCost")} />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-14 bg-[#1A1F3C] hover:bg-black text-white font-black rounded-2xl shadow-xl shadow-blue-900/20">
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            Record Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
