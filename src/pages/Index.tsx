import ChatWidget from "@/components/ChatWidget";
import EmbedCodeGenerator from "@/components/EmbedCodeGenerator";
import { Button } from "@/components/ui/button";
import { MessageCircle, Code, Zap, Globe } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              ChatBot Made Simple
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              The easiest way to add an intelligent chatbot to any website. No coding required, just copy and paste.
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              style={{ background: "var(--gradient-primary)" }}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Try It Now
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <Code className="mr-2 h-5 w-5" />
              Get Embed Code
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl bg-card shadow-sm border">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-glow rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast Setup</h3>
            <p className="text-muted-foreground">
              Get your chatbot running in under 60 seconds. Just copy, paste, and go live.
            </p>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-card shadow-sm border">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-glow rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Works Everywhere</h3>
            <p className="text-muted-foreground">
              Compatible with any website - WordPress, Shopify, custom sites, and more.
            </p>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-card shadow-sm border">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-glow rounded-lg flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart & Responsive</h3>
            <p className="text-muted-foreground">
              Intelligent responses with a beautiful, mobile-friendly interface.
            </p>
          </div>
        </div>

        {/* Demo Section */}
        <div className="mt-20 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">See It In Action</h2>
          <p className="text-lg text-muted-foreground">
            Click the chat bubble in the bottom-right corner to try our chatbot demo
          </p>
        </div>

        {/* Embed Code Section */}
        <div className="mt-20 flex justify-center">
          <EmbedCodeGenerator />
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default Index;
