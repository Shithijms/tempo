import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Brain, User, Lightbulb, BookOpen, Calculator } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export const AIChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI tutor. I'm here to help you with your studies. What would you like to learn about today?",
      timestamp: new Date(),
      suggestions: [
        "Explain quadratic equations",
        "Help with physics problems",
        "Create a study plan",
        "Generate practice questions"
      ]
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const quickActions = [
    { icon: Calculator, label: "Math Help", prompt: "I need help with mathematics" },
    { icon: BookOpen, label: "Study Plan", prompt: "Create a study plan for me" },
    { icon: Lightbulb, label: "Explain Concept", prompt: "Explain a concept to me" },
    { icon: Brain, label: "Quiz Me", prompt: "Create a quiz for me" }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I understand you're asking about "${newMessage}". Let me help you with that. This is a simulated response - in a real implementation, this would be connected to an AI service that provides detailed explanations, step-by-step solutions, and personalized guidance based on your learning goals.`,
        timestamp: new Date(),
        suggestions: [
          "Can you give me more examples?",
          "I need practice problems",
          "Explain it differently",
          "What's the next topic?"
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleSuggestion = (suggestion: string) => {
    setNewMessage(suggestion);
};
  const handleQuickAction = (prompt: string) => {
    setNewMessage(prompt);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            AI Tutor Chat
          </h1>
          <p className="text-muted-foreground">Get instant help with your studies</p>
        </div>
      </div>
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">AI Tutor is online</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              {/* Messages */}
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.type === 'ai' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Brain className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                          
                      <div className={`max-w-[80%] space-y-2 ${message.type === 'user' ? 'order-first' : ''}`}>
                        <div className={`p-3 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-primary text-primary-foreground ml-auto' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        
                        {message.suggestions && (
                          <div className="flex flex-wrap gap-1">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="h-auto py-1 px-2 text-xs"
                                onClick={() => handleSuggestion(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      
                      {message.type === 'user' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything about your studies..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => handleQuickAction(action.prompt)}
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Study Context */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-sm mb-2">Active Courses</h4>
                <div className="space-y-1">
                  <Badge variant="secondary" className="block text-center">Advanced Math</Badge>
                  <Badge variant="secondary" className="block text-center">Physics 101</Badge>
                  <Badge variant="secondary" className="block text-center">Chemistry</Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Recent Topics</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>• Quadratic Equations</div>
                  <div>• Newton's Laws</div>
                  <div>• Chemical Bonding</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground space-y-2">
                <div>✓ Step-by-step explanations</div>
                <div>✓ Practice problem generation</div>
                <div>✓ Study plan creation</div>
                <div>✓ Concept clarification</div>
                <div>✓ Progress tracking</div>
                <div>✓ Personalized hints</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
       