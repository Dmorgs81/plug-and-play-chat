import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WIDGET_HTML = `
<div id="dmorgs-chatbot-container" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div id="dmorgs-chat-bubble" onclick="dmorgsChatbot.toggle()" style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.3s ease;">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  </div>
  <div id="dmorgs-chat-window" style="width: 350px; height: 500px; background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); display: none; position: absolute; bottom: 70px; right: 0; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 16px; display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span style="font-weight: 600;">AI Assistant</span>
      </div>
      <button onclick="dmorgsChatbot.close()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div id="dmorgs-messages" style="height: 380px; overflow-y: auto; padding: 16px; background: #f8fafc;"></div>
    <div style="padding: 16px; background: white; border-top: 1px solid #e2e8f0; display: flex; gap: 8px;">
      <input id="dmorgs-input" type="text" placeholder="Ask me about this website..." style="flex: 1; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; font-size: 14px;">
      <button onclick="dmorgsChatbot.sendMessage()" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; border: none; padding: 12px 16px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
        </svg>
      </button>
    </div>
    <div style="padding: 8px 16px; background: #f1f5f9; border-top: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 12px; color: #64748b;">
      <span>Powered by</span>
      <div style="width: 16px; height: 16px; background: linear-gradient(135deg, #0ea5e9, #0369a1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <div style="width: 8px; height: 8px; border: 2px solid white; border-radius: 50%; border-top: transparent; border-right: transparent;"></div>
      </div>
      <span style="font-weight: 600;">Dmorgs Industries</span>
    </div>
  </div>
</div>

<script>
window.dmorgsChatbot = {
  isOpen: false,
  messages: [],
  
  init: function() {
    this.addMessage("Hi! I'm your AI assistant powered by Dmorgs Industries. I can help answer questions about this website!", 'bot');
    this.crawlCurrentSite();
    
    const input = document.getElementById('dmorgs-input');
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  },
  
  toggle: function() {
    this.isOpen ? this.close() : this.open();
  },
  
  open: function() {
    document.getElementById('dmorgs-chat-window').style.display = 'block';
    document.getElementById('dmorgs-chat-bubble').style.display = 'none';
    this.isOpen = true;
  },
  
  close: function() {
    document.getElementById('dmorgs-chat-window').style.display = 'none';
    document.getElementById('dmorgs-chat-bubble').style.display = 'flex';
    this.isOpen = false;
  },
  
  addMessage: function(text, sender) {
    const messagesDiv = document.getElementById('dmorgs-messages');
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = \`
      display: flex;
      margin-bottom: 12px;
      justify-content: \${sender === 'user' ? 'flex-end' : 'flex-start'};
    \`;
    
    const bubble = document.createElement('div');
    bubble.style.cssText = \`
      max-width: 80%;
      padding: 8px 12px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.4;
      background: \${sender === 'user' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : '#ffffff'};
      color: \${sender === 'user' ? 'white' : '#1f2937'};
      border: \${sender === 'bot' ? '1px solid #e2e8f0' : 'none'};
    \`;
    bubble.textContent = text;
    
    messageDiv.appendChild(bubble);
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  },
  
  sendMessage: function() {
    const input = document.getElementById('dmorgs-input');
    const message = input.value.trim();
    if (!message) return;
    
    this.addMessage(message, 'user');
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you with information about this website. What would you like to know?",
        "Based on the website content, I can provide details about services, contact information, or general questions.",
        "I've analyzed this website and can answer questions about the content, services, or how to get in touch.",
        "This website offers various services. Would you like me to provide specific information about any particular aspect?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      this.addMessage(randomResponse, 'bot');
    }, 1000);
  },
  
  crawlCurrentSite: function() {
    // Auto-crawl the current website
    setTimeout(() => {
      this.addMessage(\`✅ I've analyzed \${window.location.hostname} and I'm ready to answer questions about it!\`, 'bot');
    }, 2000);
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => dmorgsChatbot.init());
} else {
  dmorgsChatbot.init();
}
</script>
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    
    if (url.pathname === '/widget.js') {
      // Return the widget JavaScript
      const jsCode = `
        (function() {
          if (document.getElementById('dmorgs-chatbot-container')) return;
          
          const container = document.createElement('div');
          container.innerHTML = \`${WIDGET_HTML.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
          document.body.appendChild(container.firstElementChild);
        })();
      `;
      
      return new Response(jsCode, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/javascript',
        },
      });
    }
    
    // Default response - widget info
    return new Response(JSON.stringify({
      name: 'Dmorgs Industries Chatbot Widget',
      version: '1.0.0',
      usage: 'Include <script src="https://your-project-url.supabase.co/functions/v1/chatbot-widget/widget.js"></script> in your website',
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('Error in chatbot-widget function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});