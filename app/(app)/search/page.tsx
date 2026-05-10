"use client";

import { useState } from "react";
import { Search as SearchIcon, MapPin, Star, ArrowRight, Loader2, Plane, Compass, MoveRight } from "lucide-react";
import { searchActivities } from "@/lib/actions/activities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const data = await searchActivities(query);
      setResults(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-1000 min-h-screen">
      {/* Immersive Search Hero */}
      <section className="section-padding bg-foreground text-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B35]/20 rounded-full blur-[100px] -mr-20 -mt-20" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-6 space-y-10">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#FF6B35]">Global Database</p>
            <h1 className="text-7xl md:text-8xl font-display leading-tight tracking-tighter">
              Explore <br />
              <span className="text-[#FF6B35] italic">Intelligence.</span>
            </h1>
            <p className="text-xl text-background/60 leading-relaxed max-w-sm font-medium">
              Access curated data points for over 10,000+ global landmarks and activities.
            </p>
          </div>
          
          <div className="lg:col-span-6">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-0 bg-[#FF6B35] rounded-full blur-2xl opacity-10 group-focus-within:opacity-20 transition-opacity" />
              <Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Target city or landmark..."
                className="relative bg-white/5 border-none h-24 rounded-full pl-12 pr-40 text-3xl font-display text-white placeholder:text-white/10 focus-visible:ring-2 focus-visible:ring-[#FF6B35] transition-all"
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="absolute right-3 top-3 h-18 rounded-full bg-[#FF6B35] hover:bg-orange-500 text-white px-10 font-black uppercase tracking-widest text-xs"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Query Database"}
              </Button>
            </form>
            <div className="flex gap-4 mt-6 px-8">
               {['History', 'Adventure', 'Food', 'Culture'].map(tag => (
                 <button key={tag} onClick={() => { setQuery(tag); handleSearch(); }} className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-[#FF6B35] transition-colors">{tag}</button>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Exhibition */}
      <section className="section-padding max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-6">
                <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : searched && results.length === 0 ? (
          <EmptyState 
            title="Coordinate Not Found"
            description={`System scan for "${query}" returned zero matches. Verify spelling or expand search area.`}
            icon={Compass}
          />
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
            {results.map((activity) => (
              <div key={activity.id} className="group cursor-pointer">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-8 bg-muted shadow-2xl">
                  <img 
                    src={`https://images.unsplash.com/photo-1500000000000?q=80&w=800&fit=crop&sig=${activity.id}`} 
                    alt={activity.name}
                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-white text-black border-none rounded-full px-4 py-1 font-black text-[8px] uppercase tracking-widest">{activity.category}</Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-4xl font-display group-hover:text-[#FF6B35] transition-colors">{activity.name}</h3>
                    <div className="flex items-center text-xs font-black tracking-tighter">
                      <Star className="h-3 w-3 fill-[#FF6B35] text-[#FF6B35] mr-1" /> 4.9
                    </div>
                  </div>
                  <p className="text-muted-foreground font-medium leading-relaxed italic border-l border-foreground/10 pl-6">
                    {activity.description}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-foreground/5">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                        <MapPin size={12} className="text-[#FF6B35]" /> {activity.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                       <span className="text-xl font-display">${activity.cost}</span>
                       <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center group-hover:bg-[#FF6B35] group-hover:text-white transition-all">
                          <ArrowRight size={18} />
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 space-y-8 opacity-20 hover:opacity-100 transition-opacity duration-1000">
             <div className="text-[12rem] font-display text-foreground pointer-events-none select-none">SCAN.</div>
             <p className="text-xs font-black uppercase tracking-[1em] ml-8">Awaiting Input Protocol</p>
          </div>
        )}
      </section>
    </div>
  );
}
