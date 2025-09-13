interface CrawlResult {
  success: boolean;
  data?: any[];
  error?: string;
}

export class WebsiteCrawler {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  
  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async crawlWebsite(url: string): Promise<CrawlResult> {
    // For demo purposes, simulate crawling with dummy data
    const demoData = [
      {
        url,
        markdown: `# Welcome to ${new URL(url).hostname}
        
This is a demo website with information about our products and services. 

## Our Services
- Web Development
- Mobile Apps  
- AI Chatbots
- Digital Marketing

## About Us
We are a leading technology company focused on innovation and customer satisfaction.

## Contact
Email: info@${new URL(url).hostname}
Phone: (555) 123-4567`,
        metadata: {
          title: `${new URL(url).hostname} - Home`,
          description: "Demo website for chatbot integration"
        }
      }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      data: demoData
    };
  }

  static async searchCrawledContent(query: string, crawledData: any[]): Promise<string> {
    if (!crawledData || crawledData.length === 0) {
      return "I don't have any website information yet. Please crawl a website first.";
    }

    const content = crawledData[0].markdown.toLowerCase();
    const queryLower = query.toLowerCase();

    // Simple keyword matching for demo
    if (content.includes(queryLower)) {
      const lines = crawledData[0].markdown.split('\n');
      const relevantLines = lines.filter(line => 
        line.toLowerCase().includes(queryLower)
      );
      
      if (relevantLines.length > 0) {
        return `Based on the website content: ${relevantLines.slice(0, 3).join(' ')}`;
      }
    }

    // Fallback responses based on common queries
    if (queryLower.includes('contact') || queryLower.includes('email') || queryLower.includes('phone')) {
      return "You can contact us at info@" + new URL(crawledData[0].url).hostname + " or call (555) 123-4567.";
    }
    
    if (queryLower.includes('service') || queryLower.includes('what do you do')) {
      return "We offer web development, mobile apps, AI chatbots, and digital marketing services.";
    }
    
    if (queryLower.includes('about')) {
      return "We are a leading technology company focused on innovation and customer satisfaction.";
    }

    return "I found information about " + new URL(crawledData[0].url).hostname + " but couldn't find specific details about your question. You might want to browse their website directly.";
  }
}