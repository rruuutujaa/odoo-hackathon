"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getPosts, addPost, likePost } from "@/lib/actions/community";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { 
  Users, 
  Plus, 
  Heart, 
  MessageSquare, 
  Share2, 
  Loader2, 
  Search,
  Plane,
  Globe
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
    // Optimistic UI
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    await likePost(id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#1A1F3C]">Travel Community</h1>
          <p className="text-muted-foreground font-medium mt-1">Connect with explorers and share your latest adventures.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-blue-100">
            <Globe size={16} /> 1.2k Active Now
          </div>
        </div>
      </div>

      {/* Post Creation */}
      <Card className="border-none shadow-xl rounded-2xl bg-white overflow-hidden border-t-8 border-t-[#FF6B35]">
        <CardContent className="p-6">
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <div className="flex gap-4">
              <Avatar className="h-10 w-10 border border-muted">
                <AvatarFallback className="bg-orange-50 text-[#FF6B35] font-bold">
                  {session?.user?.firstName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <Textarea 
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share a travel tip, a photo, or your dream destination..."
                className="flex-1 min-h-[100px] border-none bg-muted/20 rounded-xl text-lg p-4 focus-visible:ring-1 focus-visible:ring-[#FF6B35]"
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-muted/50">
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="sm" className="rounded-lg text-muted-foreground hover:text-[#FF6B35]">
                  <Plane size={18} className="mr-2" /> Tag Trip
                </Button>
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting || !newPost.trim()}
                className="bg-[#FF6B35] hover:bg-[#E85A24] text-white rounded-xl font-bold px-8"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Search & Filters */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input 
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value === "") fetchPosts();
          }}
          onKeyDown={(e) => e.key === "Enter" && fetchPosts(searchQuery)}
          placeholder="Search community posts..."
          className="pl-12 h-14 bg-white shadow-sm border-muted/50 rounded-2xl text-lg font-medium"
        />
      </div>

      {/* Posts Feed */}
      {loading && posts.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#FF6B35]" />
          <p className="text-muted-foreground font-bold animate-pulse uppercase tracking-widest text-xs">Exploring Feed...</p>
        </div>
      ) : posts.length === 0 ? (
        <EmptyState 
          title="No posts found"
          description="Be the first one to share an adventure with the community!"
          icon={Users}
        />
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="border-none shadow-sm rounded-2xl bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-muted">
                      <AvatarFallback className="bg-[#1A1F3C] text-white font-bold">
                        {post.user.firstName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-[#1A1F3C]">{post.user.firstName} {post.user.lastName}</h4>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
                        {post.user.city && `${post.user.city}, `}{post.user.country} • {formatDistanceToNow(new Date(post.createdAt))} ago
                      </p>
                    </div>
                  </div>
                  {post.trip && (
                    <Badge className="bg-orange-50 text-[#FF6B35] border-none hover:bg-orange-100 flex items-center gap-1.5 px-3 py-1">
                      <Plane size={12} /> {post.trip.title}
                    </Badge>
                  )}
                </div>

                <p className="text-[#1A1F3C] text-lg leading-relaxed mb-6 font-medium">
                  {post.content}
                </p>

                <div className="flex items-center gap-6 pt-4 border-t border-muted/30">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors group"
                  >
                    <div className="p-2 rounded-lg group-hover:bg-red-50 transition-colors">
                      <Heart size={20} className={post.likes > 0 ? "fill-red-500 text-red-500" : ""} />
                    </div>
                    <span className="font-bold text-sm">{post.likes}</span>
                  </button>
                  
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors group">
                    <div className="p-2 rounded-lg group-hover:bg-blue-50 transition-colors">
                      <MessageSquare size={20} />
                    </div>
                    <span className="font-bold text-sm">Comment</span>
                  </button>

                  <button className="flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-colors group ml-auto">
                    <div className="p-2 rounded-lg group-hover:bg-green-50 transition-colors">
                      <Share2 size={20} />
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
