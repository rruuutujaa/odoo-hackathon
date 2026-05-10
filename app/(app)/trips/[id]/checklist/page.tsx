"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getPackingItems, addPackingItem, togglePackingItem, resetChecklist, getChecklistProgress } from "@/lib/actions/checklist";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { 
  ClipboardCheck, 
  Plus, 
  RotateCcw, 
  CheckCircle2, 
  Circle, 
  Loader2, 
  ArrowLeft,
  Briefcase,
  FileText,
  Smartphone,
  Shirt,
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const categoryIcons: Record<string, any> = {
  DOCUMENTS: FileText,
  CLOTHING: Shirt,
  ELECTRONICS: Smartphone,
  OTHER: Briefcase
};

export default function ChecklistPage() {
  const params = useParams();
  const tripId = params.id as string;
  const [items, setItems] = useState<any[]>([]);
  const [progress, setProgress] = useState({ packed: 0, total: 0, percent: 0 });
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any>("OTHER");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getPackingItems(tripId);
      const prog = await getChecklistProgress(tripId);
      setItems(data);
      setProgress(prog);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tripId]);

  const handleToggle = async (id: string, current: boolean) => {
    // Optimistic UI
    setItems(items.map(i => i.id === id ? { ...i, isPacked: !current } : i));
    await togglePackingItem(id, !current);
    const prog = await getChecklistProgress(tripId);
    setProgress(prog);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    
    await addPackingItem({
      tripId,
      itemName: newItemName,
      category: selectedCategory,
      isPacked: false
    });
    setNewItemName("");
    fetchData();
  };

  const handleReset = async () => {
    if (confirm("Reset all items to unpacked?")) {
      await resetChecklist(tripId);
      fetchData();
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#FF6B35]" />
      </div>
    );
  }

  const groupedItems = items.reduce((acc: any, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href={`/trips/${tripId}`} className="flex items-center gap-2 text-muted-foreground hover:text-[#FF6B35] transition-colors font-bold text-sm">
          <ArrowLeft size={16} /> Back to Trip Details
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#1A1F3C]">Packing Checklist</h1>
            <p className="text-muted-foreground font-medium mt-1">Don't forget the essentials for your adventure.</p>
          </div>
          <Button variant="outline" onClick={handleReset} className="rounded-xl font-bold border-muted-foreground/20">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset All
          </Button>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="border-none shadow-lg rounded-2xl bg-[#1A1F3C] text-white p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <p className="text-white/60 font-bold uppercase tracking-widest text-xs">Trip Progress</p>
            <h3 className="text-3xl font-black">{progress.percent}% Ready</h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-[#FF6B35]">{progress.packed} / {progress.total}</p>
            <p className="text-white/60 text-xs font-bold uppercase">Items Packed</p>
          </div>
        </div>
        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress.percent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#FF6B35] to-orange-400" 
          />
        </div>
      </Card>

      {/* Add Item Inline */}
      <Card className="border-none shadow-md rounded-2xl bg-white overflow-hidden">
        <CardContent className="p-4">
          <form onSubmit={handleAddItem} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-muted/50 rounded-xl px-4 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              >
                <option value="DOCUMENTS">Docs</option>
                <option value="CLOTHING">Clothes</option>
                <option value="ELECTRONICS">Tech</option>
                <option value="OTHER">Misc</option>
              </select>
              <Input 
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Add a new item (e.g. Passport, Charger...)" 
                className="rounded-xl border-none bg-muted/30 font-medium h-12"
              />
            </div>
            <Button type="submit" className="bg-[#FF6B35] hover:bg-[#E85A24] text-white rounded-xl h-12 font-bold px-8">
              <Plus className="mr-2 h-5 w-5" /> Add Item
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Checklist Sections */}
      {items.length === 0 ? (
        <EmptyState
          title="List is empty"
          description="Your packing list is currently empty. Start adding items above."
          icon={ClipboardCheck}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(groupedItems).map(([category, catItems]: [string, any]) => {
            const Icon = categoryIcons[category] || Briefcase;
            return (
              <section key={category} className="space-y-4">
                <h3 className="flex items-center gap-2 font-black text-[#1A1F3C] text-lg uppercase tracking-wider px-2">
                  <Icon size={20} className="text-[#FF6B35]" /> {category}
                </h3>
                <div className="space-y-2">
                  {catItems.map((item: any) => (
                    <div 
                      key={item.id} 
                      onClick={() => handleToggle(item.id, item.isPacked)}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer border ${item.isPacked ? 'bg-muted/30 border-transparent opacity-60' : 'bg-white shadow-sm border-muted/50 hover:border-[#FF6B35]/30'}`}
                    >
                      {item.isPacked ? (
                        <CheckCircle2 className="text-[#FF6B35] shrink-0" size={24} />
                      ) : (
                        <Circle className="text-muted-foreground/30 shrink-0" size={24} />
                      )}
                      <span className={`font-bold flex-1 ${item.isPacked ? 'line-through text-muted-foreground' : 'text-[#1A1F3C]'}`}>
                        {item.itemName}
                      </span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/50 hover:text-destructive transition-colors">
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
