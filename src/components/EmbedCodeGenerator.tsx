import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const EmbedCodeGenerator = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const embedCode = `<!-- Chatbot Widget -->
<div id="chatbot-widget"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://your-domain.com/chatbot.js';
    script.async = true;
    script.onload = function() {
      ChatbotWidget.init({
        containerId: 'chatbot-widget',
        theme: 'blue',
        position: 'bottom-right'
      });
    };
    document.head.appendChild(script);
  })();
</script>`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy embed code",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Easy Website Integration
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
            className="ml-2"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy Code"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Simply copy and paste this code into any website to add the chatbot widget:
          </p>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
            <code>{embedCode}</code>
          </pre>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Works on any website</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>No technical knowledge required</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Fully customizable</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmbedCodeGenerator;