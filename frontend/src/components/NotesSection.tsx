import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Edit, Trash2, Brain, User, BookOpen } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'personal' | 'ai';
  subject: string;
  createdAt: Date;
  tags: string[];
}

export const NotesSection = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Quadratic Equations - Key Concepts',
      content: 'A quadratic equation is a polynomial equation of degree 2. The standard form is ax² + bx + c = 0, where a ≠ 0...',
      type: 'ai',
      subject: 'Mathematics',
      createdAt: new Date('2024-01-10'),
      tags: ['algebra', 'equations', 'formulas']
    },
    {
      id: '2',
      title: 'Physics Study Session Notes',
      content: 'Today we covered Newton\'s laws of motion. First law: An object at rest stays at rest unless acted upon by an external force...',
      type: 'personal',
      subject: 'Physics',
      createdAt: new Date('2024-01-12'),
      tags: ['newton', 'laws', 'motion']
    },
    {
      id: '3',
      title: 'Chemical Bonding Summary',
      content: 'Chemical bonds are forces that hold atoms together in compounds. Main types: ionic, covalent, and metallic bonds...',
      type: 'ai',
      subject: 'Chemistry',
      createdAt: new Date('2024-01-15'),
      tags: ['bonding', 'ionic', 'covalent']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    subject: '',
    tags: ''
  });

  const personalNotes = notes.filter(note => note.type === 'personal');
  const aiNotes = notes.filter(note => note.type === 'ai');

  const filteredNotes = (notesList: Note[]) => 
    notesList.filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleCreateNote = () => {
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      type: 'personal',
      subject: newNote.subject,
      createdAt: new Date(),
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '', subject: '', tags: '' });
    setIsCreating(false);
    setSelectedNote(note);
  };

  const generateAINote = () => {
    const aiNote: Note = {
      id: Date.now().toString(),
      title: 'AI-Generated Study Summary',
      content: 'This is a simulated AI-generated note. In a real implementation, this would contain AI-generated summaries, explanations, or study materials based on your current learning topics and progress.',
      type: 'ai',
      subject: 'General',
      createdAt: new Date(),
      tags: ['ai-generated', 'summary']
    };

    setNotes([aiNote, ...notes]);
    setSelectedNote(aiNote);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" />
            Study Notes
          </h1>
          <p className="text-muted-foreground">Organize your personal notes and AI-generated content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateAINote} className="gap-2">
            <Brain className="w-4 h-4" />
            Generate AI Note
          </Button>
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Note
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mx-4 mb-4">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="personal" className="text-xs">Personal</TabsTrigger>
                  <TabsTrigger value="ai" className="text-xs">AI Notes</TabsTrigger>
                </TabsList>
                
                <ScrollArea className="h-[500px]">
                  <TabsContent value="all" className="space-y-2 px-4">
                    {filteredNotes(notes).map((note) => (
                      <div
                        key={note.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedNote?.id === note.id ? 'bg-primary/10 border-primary' : ''
                        }`}
                        onClick={() => setSelectedNote(note)}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          {note.type === 'ai' ? (
                            <Brain className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          ) : (
                            <User className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium line-clamp-2">{note.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {note.content}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {note.subject}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {note.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="personal" className="space-y-2 px-4">
                    {filteredNotes(personalNotes).map((note) => (
                      <div
                        key={note.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedNote?.id === note.id ? 'bg-primary/10 border-primary' : ''
                        }`}
                        onClick={() => setSelectedNote(note)}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <User className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium line-clamp-2">{note.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {note.content}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {note.subject}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {note.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="ai" className="space-y-2 px-4">
                    {filteredNotes(aiNotes).map((note) => (
                      <div
                        key={note.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedNote?.id === note.id ? 'bg-primary/10 border-primary' : ''
                        }`}
                        onClick={() => setSelectedNote(note)}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <Brain className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium line-clamp-2">{note.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {note.content}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {note.subject}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {note.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Note Editor/Viewer */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            {isCreating ? (
              <>
                <CardHeader>
                  <CardTitle>Create New Note</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        placeholder="Note title..."
                        value={newNote.title}
                        onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <Input
                        placeholder="Subject..."
                        value={newNote.subject}
                        onChange={(e) => setNewNote({...newNote, subject: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags (comma separated)</label>
                    <Input
                      placeholder="study, important, exam..."
                      value={newNote.tags}
                      onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                      placeholder="Write your note content here..."
                      value={newNote.content}
                      onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                      className="h-[300px] resize-none"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateNote}
                      disabled={!newNote.title || !newNote.content}
                    >
                      Save Note
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : selectedNote ? (
              <>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {selectedNote.type === 'ai' ? (
                        <Brain className="w-5 h-5 text-primary" />
                      ) : (
                        <User className="w-5 h-5 text-secondary" />
                      )}
                      <div>
                        <CardTitle>{selectedNote.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{selectedNote.subject}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {selectedNote.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{selectedNote.content}</p>
                    </div>
                  </ScrollArea>
                  
                  {selectedNote.tags.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">Tags:</span>
                        {selectedNote.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a note to view or create a new one</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};