"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getNotes, addNote, updateNote, deleteNote } from "@/lib/actions/notes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { 
  NotebookPen, 
  Plus, 
  Calendar, 
  Trash2, 
  Edit3, 
  Loader2, 
  ArrowLeft,
  Clock,
  LayoutGrid
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function NotesPage() {
  const params = useParams();
  const tripId = params.id as string;
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dayNumber, setDayNumber] = useState<number | undefined>(undefined);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchNotes = async (filter?: any) => {
    setLoading(true);
    try {
      const data = await getNotes(tripId, filter);
      setNotes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [tripId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({ variant: "destructive", title: "Missing Title", description: "Please enter a title for your note." });
      return;
    }
    if (!content.trim()) {
      toast({ variant: "destructive", title: "Empty Content", description: "The note content cannot be empty." });
      return;
    }

    setIsSubmitting(true);
    try {
      await addNote({
        tripId,
        title,
        content,
        dayNumber
      });
      setTitle("");
      setContent("");
      setDayNumber(undefined);
      setShowAdd(false);
      fetchNotes();
      toast({ title: "Note Saved", description: "Your memory has been logged successfully." });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Save Failed", description: "An error occurred while saving your note." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this note?")) {
      await deleteNote(id);
      fetchNotes();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href={`/trips/${tripId}`} className="flex items-center gap-2 text-muted-foreground hover:text-[#FF6B35] transition-colors font-bold text-sm">
          <ArrowLeft size={16} /> Back to Trip Details
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#1A1F3C]">Trip Journal</h1>
            <p className="text-muted-foreground font-medium mt-1">Capture your travel memories and important details.</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)} className="bg-[#1A1F3C] hover:bg-black text-white rounded-xl h-12 px-6 font-bold">
            <Plus className="mr-2 h-5 w-5" /> New Note
          </Button>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <Card className="border-none shadow-xl rounded-2xl bg-white p-6 border-l-8 border-l-[#FF6B35]">
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note Title..." 
                  className="rounded-xl font-black text-lg border-none bg-muted/20 h-12"
                />
              </div>
              <div>
                <Input 
                  type="number"
                  value={dayNumber || ""}
                  onChange={(e) => setDayNumber(parseInt(e.target.value))}
                  placeholder="Day #" 
                  className="rounded-xl font-bold border-none bg-muted/20 h-12"
                />
              </div>
            </div>
            <Textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What happened today? Write your memories here..." 
              className="min-h-[150px] rounded-xl border-none bg-muted/20 text-lg font-medium p-6"
            />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setShowAdd(false)} className="rounded-xl font-bold">Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#FF6B35] hover:bg-[#E85A24] text-white rounded-xl font-bold px-8 h-11 shadow-lg shadow-[#FF6B35]/20">
                {isSubmitting ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                Save Entry
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Notes Grid */}
      <Tabs defaultValue="all" className="space-y-8" onValueChange={(val) => fetchNotes(val === 'all' ? {} : {})}>
        <div className="flex items-center justify-between border-b border-muted/50 pb-2">
          <TabsList className="bg-transparent gap-8 h-auto p-0">
            <TabsTrigger value="all" className="p-0 pb-2 rounded-none bg-transparent font-black text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-[#FF6B35] data-[state=active]:border-b-4 data-[state=active]:border-[#FF6B35]">Everything</TabsTrigger>
            <TabsTrigger value="day" className="p-0 pb-2 rounded-none bg-transparent font-black text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-[#FF6B35] data-[state=active]:border-b-4 data-[state=active]:border-[#FF6B35]">By Day</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-muted-foreground" /></div>
          ) : notes.length === 0 ? (
            <EmptyState
              title="No entries yet"
              description="Start documenting your trip by creating your first journal entry."
              icon={NotebookPen}
            />
          ) : (
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {notes.map((note) => (
                <Card key={note.id} className="break-inside-avoid border-none shadow-sm rounded-2xl bg-white p-6 hover:shadow-md transition-shadow group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-orange-50 text-[#FF6B35]">
                        <Clock size={16} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {format(new Date(note.createdAt), "MMM dd, HH:mm")}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(note.id)} className="h-8 w-8 text-muted-foreground/30 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <h3 className="text-xl font-black text-[#1A1F3C] mb-2">{note.title}</h3>
                  {note.dayNumber && <Badge className="mb-4 bg-[#1A1F3C] text-white">Day {note.dayNumber}</Badge>}
                  <p className="text-muted-foreground font-medium leading-relaxed whitespace-pre-wrap">{note.content}</p>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
