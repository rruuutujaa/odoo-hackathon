"use client";

import { useState } from "react";
import { Search as SearchIcon, MapPin, Star, ArrowRight, Loader2, Compass, MoveRight } from "lucide-react";
import { searchActivities } from "@/lib/actions/activities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

const CATEGORY_IMAGES: Record<string, string> = {
  SIGHTSEEING: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&fit=crop",
  FOOD: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&fit=crop",
  ADVENTURE: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=800&fit=crop",
  CULTURE: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&fit=crop",
  SOCIAL: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&fit=crop",
  SHOPPING: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&fit=crop",
  OTHER: "https://images.unsplash.com/photo-1500000000000?q=80&w=800&fit=crop"
};

const MOCK_FALLBACKS = [
  {
    id: "mock-1",
    name: "Eiffel Tower Private Summit",
    category: "SIGHTSEEING",
    description: "Exclusive access to the highest point in Paris with a private historical briefing.",
    location: "Paris, France",
    cost: 150,
    duration: 3,
    rating: 4.9,
    img: CATEGORY_IMAGES.SIGHTSEEING
  },
  {
    id: "mock-2",
    name: "Tokyo Midnight Street Food",
    category: "FOOD",
    description: "Navigate the neon-lit alleys of Shinjuku to find the city's best hidden ramen and yakitori.",
    location: "Tokyo, Japan",
    cost: 85,
    duration: 4,
    rating: 4.8,
    img: CATEGORY_IMAGES.FOOD
  },
  {
    id: "mock-3",
    name: "Swiss Alps Helicopter Flight",
    category: "ADVENTURE",
    description: "A breathtaking aerial tour over the Eiger, Mönch, and Jungfrau peaks with glacier landing.",
    location: "Interlaken, CH",
    cost: 450,
    duration: 1,
    rating: 5.0,
    img: CATEGORY_IMAGES.ADVENTURE
  },
  {
    id: "mock-4",
    name: "Kyoto Zen Temple Meditation",
    category: "CULTURE",
    description: "A transformative session with a resident monk in one of Kyoto's most secluded gardens.",
    location: "Kyoto, Japan",
    cost: 40,
    duration: 2,
    rating: 4.7,
    img: CATEGORY_IMAGES.CULTURE
  }
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setSearched(true);
    
    try {
      const data = await searchActivities(query);
      if (!data || data.length === 0) {
        setResults(MOCK_FALLBACKS);
      } else {
        setResults(data);
      }
    } catch (error) {
      console.error(error);
      setResults(MOCK_FALLBACKS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-1000 min-h-screen">
      {/* Hero */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#0A0A0A] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B35]/20 rounded-full blur-[100px] -mr-20 -mt-20" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <div className="lg:col-span-6 space-y-10">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#FF6B35]">Global Database</p>
            <h1 className="text-7xl md:text-8xl font-display leading-tight tracking-tighter text-white">
              Explore <br />
              <span className="text-[#FF6B35] italic">Intelligence.</span>
            </h1>
            <p className="text-xl text-white/60 leading-relaxed max-w-sm font-medium">
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
                className="relative bg-white/10 border-none h-24 rounded-full pl-12 pr-40 text-3xl font-display text-white placeholder:text-white/20 focus-visible:ring-2 focus-visible:ring-[#FF6B35] transition-all shadow-2xl"
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="absolute right-3 top-3 h-18 rounded-full bg-[#FF6B35] hover:bg-orange-500 text-white px-10 font-black uppercase tracking-widest text-[10px] shadow-xl"
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

      {/* Results */}
      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
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
        ) : searched ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
            {results.map((activity) => (
              <div key={activity.id} className="group cursor-pointer">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-8 bg-muted shadow-2xl">
                  <img 
                    src={activity.img || CATEGORY_IMAGES[activity.category?.toUpperCase()] || CATEGORY_IMAGES.SIGHTSEEING} 
                    alt={activity.name}
                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-white text-black border-none rounded-full px-4 py-1 font-black text-[8px] uppercase tracking-widest shadow-xl">{activity.category}</Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-4xl font-display group-hover:text-[#FF6B35] transition-colors">{activity.name}</h3>
                    <div className="flex items-center text-xs font-black tracking-tighter">
                      <Star className="h-3 w-3 fill-[#FF6B35] text-[#FF6B35] mr-1" /> {activity.rating || 4.9}
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
