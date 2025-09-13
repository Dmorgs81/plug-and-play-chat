import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Minimize2, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { WebsiteCrawler } from "@/services/WebsiteCrawler";
import dmorgsLogo from "@/assets/dmorgs-logo.png";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI assistant powered by Dmorgs Industries. I can help answer questions about any website. Try asking me something or let me crawl a website first!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [crawledData, setCrawledData] = useState<any[]>([]);
  const [isCrawling, setIsCrawling] = useState(false);
  const [currentWebsite, setCurrentWebsite] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");

    // Check if user wants to crawl a website
    const urlMatch = currentInput.match(/https?:\/\/[^\s]+/);
    if (urlMatch || currentInput.toLowerCase().includes('crawl') || currentInput.toLowerCase().includes('website')) {
      const url = urlMatch ? urlMatch[0] : 'https://demo-website.com';
      
      setIsCrawling(true);
      const loadingMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `🔍 Crawling ${url}... This may take a few moments.`,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, loadingMessage]);

      try {
        const result = await WebsiteCrawler.crawlWebsite(url);
        if (result.success && result.data) {
          setCrawledData(result.data);
          setCurrentWebsite(url);
          const successMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: `✅ Successfully crawled ${url}! I now have access to the website's content. You can ask me questions about it.`,
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages(prev => prev.slice(0, -1).concat(successMessage));
        }
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 3).toString(),
          text: "Sorry, I couldn't crawl that website. Please try again or ask me a general question.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages(prev => prev.slice(0, -1).concat(errorMessage));
      } finally {
        setIsCrawling(false);
      }
    } else {
      // Generate AI response based on crawled data
      setTimeout(async () => {
        const response = await WebsiteCrawler.searchCrawledContent(currentInput, crawledData);
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Bubble */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-chat-bubble to-chat-bubble-hover shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-elegant)",
          }}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card 
          className={`w-80 transition-all duration-300 ${
            isMinimized ? "h-14" : "h-96"
          }`}
          style={{
            boxShadow: "var(--shadow-chat)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-primary-glow text-primary-foreground rounded-t-lg">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">AI Assistant</span>
              {currentWebsite && (
                <div className="flex items-center space-x-1 text-xs bg-white/20 px-2 py-1 rounded">
                  <Globe className="h-3 w-3" />
                  <span className="truncate max-w-20">{new URL(currentWebsite).hostname}</span>
                </div>
              )}
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0 text-primary-foreground hover:bg-white/20"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-primary-foreground hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 space-y-4 h-64 overflow-y-auto bg-gradient-to-b from-chat-background to-secondary/20">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                      style={{
                        background: message.sender === "user" 
                          ? "var(--gradient-primary)"
                          : "hsl(var(--secondary))"
                      }}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex items-center space-x-2 p-4 border-t bg-background">
                <Input
                  placeholder={crawledData.length > 0 ? "Ask me about the website..." : "Enter a website URL to crawl or ask a question..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  disabled={isCrawling}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isCrawling}
                  className="bg-primary hover:bg-primary-glow"
                  style={{
                    background: "var(--gradient-primary)",
                  }}
                >
                  {isCrawling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              
              {/* Powered by Dmorgs Industries */}
              <div className="flex items-center justify-center p-2 border-t bg-muted/30">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>Powered by</span>
                  <img 
                    src={dmorgsLogo} 
                    alt="Dmorgs Industries" 
                    className="h-4 w-4 rounded-full bg-white/10 p-0.5"
                  />
                  <span className="font-medium">Dmorgs Industries</span>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default ChatWidget;