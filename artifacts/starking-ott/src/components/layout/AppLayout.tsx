import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ReactNode, useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import { Link } from "wouter";

export function AppLayout({ children }: { children: ReactNode }) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("telegram_banner_dismissed");
    if (!dismissed) {
      setShowBanner(true);
    }
  }, []);

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem("telegram_banner_dismissed", "true");
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col text-foreground selection:bg-primary/30 selection:text-primary transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full relative">
        {children}
      </main>
      <Footer />
      
      {/* Telegram Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-full duration-500">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-primary/10 border border-primary/20 backdrop-blur-xl rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
              
              <div className="flex items-center gap-4 z-10 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Send className="w-6 h-6 text-primary ml-1" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Join our Telegram Channel</h4>
                  <p className="text-sm text-muted-foreground">Daily movie & TV updates, requests, and news.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto z-10">
                <a 
                  href="https://t.me/starskingsye" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-full font-bold text-sm transition-colors text-center"
                >
                  Join Channel
                </a>
                <button 
                  onClick={dismissBanner}
                  className="w-10 h-10 rounded-full hover:bg-foreground/5 flex items-center justify-center shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
