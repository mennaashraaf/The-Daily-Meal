import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { aiAPI } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, User, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AITextResponse, AIInteraction } from "@/lib/types";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  citations?: string[];
}

export default function AIChat() {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch chat history
  const { data: history } = useQuery({
    queryKey: ['/api/ai/history'],
    queryFn: () => aiAPI.getHistory(10),
    enabled: isAuthenticated
  });
  
  // Initialize with welcome message if no history
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: "Hi there! I'm Chef Rania. How can I help you today? You can ask me about recipes, cooking techniques, or ingredient substitutions.",
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    }
    
    // Load chat history if available
    if (history && history.length > 0 && messages.length <= 1) {
      const historyMessages: Message[] = [];
      
      history.forEach((interaction: AIInteraction) => {
        // Add user message
        historyMessages.push({
          id: `user-${interaction.id}`,
          content: interaction.query,
          sender: "user",
          timestamp: new Date(interaction.created_at),
        });
        
        // Add AI response
        if (interaction.response) {
          const response = interaction.response as AITextResponse;
          historyMessages.push({
            id: `ai-${interaction.id}`,
            content: response.content,
            sender: "assistant",
            timestamp: new Date(interaction.created_at),
            citations: response.citations
          });
        }
      });
      
      setMessages([
        {
          id: "welcome",
          content: "Hi there! I'm Chef Rania. How can I help you today? You can ask me about recipes, cooking techniques, or ingredient substitutions.",
          sender: "assistant",
          timestamp: new Date(),
        },
        ...historyMessages.reverse()
      ]);
    }
  }, [history]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: aiAPI.sendMessage,
    onSuccess: (response) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          content: response.content,
          sender: "assistant",
          timestamp: new Date(),
          citations: response.citations
        },
      ]);
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    
    // Send message to API
    sendMessageMutation.mutate(inputMessage);
  };
  
  // Format message with citations
  const formatMessage = (message: string) => {
    return message.split("\n").map((line, i) => (
      <p key={i} className={line.trim() === "" ? "h-4" : "mb-2"}>
        {line}
      </p>
    ));
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-xl overflow-hidden border">
      <div className="bg-primary p-4">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-2">
            <AvatarImage src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c" />
            <AvatarFallback>CR</AvatarFallback>
          </Avatar>
          <h2 className="text-white font-heading font-bold text-xl">Chef Rania</h2>
        </div>
        <p className="text-white/80 text-sm mt-1">
          Your AI-powered cooking assistant
        </p>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex mb-4 ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg p-3 max-w-[80%] ${
                message.sender === "user"
                  ? "bg-primary/10 text-neutral-800"
                  : "bg-yellow-50"
              }`}
            >
              {message.sender === "assistant" && (
                <div className="flex items-center mb-2">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c" />
                    <AvatarFallback>CR</AvatarFallback>
                  </Avatar>
                  <span className="font-heading font-bold text-sm">Chef Rania</span>
                </div>
              )}
              
              <div className="text-sm">
                {formatMessage(message.content)}
              </div>
              
              {message.citations && message.citations.length > 0 && (
                <div className="mt-3">
                  <Separator className="my-2" />
                  <p className="text-xs text-gray-500 font-medium mb-1">Sources:</p>
                  <div className="space-y-1">
                    {message.citations.slice(0, 3).map((citation, i) => (
                      <a
                        key={i}
                        href={citation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {new URL(citation).hostname.replace("www.", "")}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Chef Rania anything about cooking..."
            className="flex-grow mr-2"
            disabled={sendMessageMutation.isPending || !isAuthenticated}
          />
          <Button 
            type="submit" 
            disabled={sendMessageMutation.isPending || !inputMessage.trim() || !isAuthenticated}
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        {!isAuthenticated && (
          <p className="text-xs text-red-500 mt-2">
            Please log in to chat with Chef Rania
          </p>
        )}
      </div>
    </div>
  );
}
