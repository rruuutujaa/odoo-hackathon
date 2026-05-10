"use client";

import { useState } from "react";
import { Search as SearchIcon, Filter, MapPin, Star, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const supabase = createClient();

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .ilike("name", `%${query}%`);
      
      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold text-[#1A1F3C]">Discover Activities</h1>
        <p className="text-muted-foreground">Find the best things to do in any city around the world</p>
        
        <form onSubmit={handleSearch} className="relative mt-8">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search activities, landmarks, cities..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-14 bg-card shadow-lg border-none rounded-[16px] text-lg focus-visible:ring-1 pr-32"
          />
          <Button 
            type="submit" 
            disabled={loading}
            className="absolute right-2 top-2 h-10 bg-[#FF6B35] hover:bg-[#E85A24] text-white rounded-[12px] px-6"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </form>

        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="outline" size="sm" className="rounded-full border-muted-foreground/20 text-xs">
            <Filter className="mr-1 h-3 w-3" /> Filters
          </Button>
          <Button variant="outline" size="sm" className="rounded-full border-muted-foreground/20 text-xs">Sort By</Button>
          <Button variant="outline" size="sm" className="rounded-full border-muted-foreground/20 text-xs">Group By</Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="rounded-[16px] overflow-hidden">
                <div className="flex flex-col md:flex-row gap-4 p-4">
                  <Skeleton className="w-full md:w-48 aspect-video rounded-lg" />
                  <div className="flex-1 space-y-3 py-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : searched && results.length === 0 ? (
          <EmptyState 
            title="No results found"
            description={`We couldn't find any activities matching "${query}". Try searching for a different city or activity.`}
            icon={MapPin}
          />
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {results.map((activity) => (
              <Card key={activity.id} className="group rounded-[16px] overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-48 h-48 md:h-auto relative">
                      <img 
                        src={`https://images.unsplash.com/photo-1500000000000?q=80&w=400&h=400&fit=crop&sig=${activity.id}`} 
                        alt={activity.name}
                        className="h-full w-full object-cover"
                      />
                      <Badge className="absolute top-2 left-2 bg-white/90 text-primary hover:bg-white">
                        {activity.category}
                      </Badge>
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h3 className="text-xl font-bold text-[#1A1F3C] group-hover:text-primary transition-colors">{activity.name}</h3>
                          <div className="flex items-center text-yellow-500 font-bold">
                            <Star className="h-4 w-4 fill-current mr-1" />
                            4.8
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-4 mt-4 text-xs font-medium text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {activity.location}
                          </span>
                          <span>Duration: {activity.duration_hours}h</span>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-lg font-black text-[#1A1F3C]">
                          ${activity.cost} <span className="text-xs font-normal text-muted-foreground">/ person</span>
                        </div>
                        <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 rounded-[10px]">
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center p-6 rounded-full bg-primary/5 mb-6">
              <MapPin className="h-12 w-12 text-primary opacity-20" />
            </div>
            <p className="text-muted-foreground font-medium">Search for cities like &quot;Paris&quot; or &quot;Tokyo&quot; to discover top things to do.</p>
          </div>
        )}
      </div>
    </div>
  );
}
