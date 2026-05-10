"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getPosts, addPost, likePost } from "@/lib/actions/community";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { 
  Users, 
  Heart, 
  MessageSquare, 
  Share2, 
  Loader2, 
  Search,
  MoveRight,
  Sparkles
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function CommunityPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPost, setNewPost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPosts = async (search?: string) => {
    setLoading(true);
    try {
      const data = await getPosts(search);
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !session?.user?.id) return;

    setIsSubmitting(true);
    try {
      await addPost({
        content: newPost,
        userId: session.user.id
      });
      setNewPost("");
      fetchPosts();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    await likePost(id);
  };

  return (
    <div className="section-padding space-y-24 animate-in fade-in duration-1000 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end">
        <div className="space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#FF6B35]">Social Uplink</p>
          <h1 className="text-8xl font-display leading-[0.85] tracking-tighter">
            Travel <br />
            <span className="text-[#FF6B35] italic">Society.</span>
          </h1>
        </div>
        <div className="max-w-sm space-y-6">
          <p className="text-xl text-muted-foreground leading-relaxed font-medium italic">
            "We travel not to escape life, but for life not to escape us."
          </p>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-foreground/40">
            <Users size={14} /> 2.4k Expeditionary Members
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Left: Feed */}
        <div className="lg:col-span-8 space-y-12">
          {/* Creative Post Entry */}
          <div className="relative group">
            <div className="absolute inset-0 bg-foreground/5 -m-2 rounded-[32px] group-hover:bg-[#FF6B35]/5 transition-colors" />
            <form onSubmit={handlePostSubmit} className="relative bg-background border border-foreground/10 p-8 rounded-2xl space-y-6">
              <Textarea 
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Log a field report or share a landmark discovery..."
                className="bg-transparent border-none text-2xl font-display placeholder:text-muted-foreground/30 focus-visible:ring-0 min-h-[120px] p-0"
              />
              <div className="flex items-center justify-between pt-6 border-t border-foreground/5">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-[#FF6B35]/10 flex items-center justify-center text-[#FF6B35]">
                      <Sparkles size={14} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neural Uplink Active</span>
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !newPost.trim()}
                  className="rounded-full bg-foreground text-background hover:bg-[#FF6B35] hover:text-white px-10 font-black uppercase tracking-widest text-[10px] h-12"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Transmit"}
                </Button>
              </div>
            </form>
          </div>

          {/* Posts Grid */}
          <div className="space-y-16">
            {posts.map((post) => (
              <div key={post.id} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="md:col-span-1">
                   <div className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center font-display text-xl bg-white text-black shadow-xl">
                      {post.user.firstName[0]}
                   </div>
                </div>
                <div className="md:col-span-11 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                         <h4 className="text-lg font-black text-foreground tracking-tight">{post.user.firstName} {post.user.lastName}</h4>
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                           {post.user.city || 'Undisclosed'} • {formatDistanceToNow(new Date(post.createdAt))}
                         </p>
                      </div>
                      {post.trip && <Badge className="rounded-full bg-foreground/5 text-foreground border-none text-[8px] px-3 font-black uppercase tracking-[0.2em]">{post.trip.title}</Badge>}
                   </div>
                   
                   <p className="text-2xl font-display leading-snug text-foreground/90">{post.content}</p>
                   
                   <div className="flex items-center gap-10 pt-4">
                      <button onClick={() => handleLike(post.id)} className="flex items-center gap-2 group">
                         <Heart size={18} className={post.likes > 0 ? "fill-[#FF6B35] text-[#FF6B35]" : "text-muted-foreground group-hover:text-[#FF6B35] transition-colors"} />
                         <span className="text-xs font-black tracking-tighter">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                         <MessageSquare size={18} />
                         <span className="text-xs font-black tracking-tighter uppercase tracking-[0.2em]">Reply</span>
                      </button>
                      <button className="text-muted-foreground hover:text-foreground transition-colors ml-auto">
                         <Share2 size={18} />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Search & Trends */}
        <div className="lg:col-span-4 space-y-16 sticky top-24 h-fit">
           <div className="relative group">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-[#FF6B35] transition-colors" size={20} />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search frequencies..."
                className="bg-transparent border-none border-b-2 border-foreground/10 rounded-none h-14 pl-8 text-xl font-display focus-visible:ring-0 focus:border-[#FF6B35] transition-all"
              />
           </div>

           <div className="space-y-8">
              <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30">Trending Coordinates</h5>
              <div className="space-y-6">
                 {['Kyoto, JP', 'Paris, FR', 'Reykjavik, IS'].map(city => (
                   <div key={city} className="flex items-center justify-between group cursor-pointer border-b border-foreground/5 pb-4">
                      <span className="text-xl font-display group-hover:text-[#FF6B35] transition-colors">{city}</span>
                      <MoveRight size={16} className="text-foreground/20 group-hover:translate-x-2 transition-transform" />
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
