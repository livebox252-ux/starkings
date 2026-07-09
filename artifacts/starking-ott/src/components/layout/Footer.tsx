import { Link } from "wouter";
import { Search, Film, Tv, Play, Send, ShieldAlert, FileText, Mail, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8 mt-auto z-10 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Crown className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-serif text-2xl font-bold tracking-tight">Star King</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Your premium destination for free movies, TV shows, and anime. High-quality streaming across all devices with daily updates.
            </p>
            <div className="pt-2">
              <a 
                href="https://t.me/starskingsye" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold bg-[#2AABEE]/10 text-[#2AABEE] hover:bg-[#2AABEE] hover:text-white px-4 py-2 rounded-full transition-colors"
              >
                <Send className="w-4 h-4" /> Join Telegram Channel
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-foreground text-lg">Navigation</h4>
            <ul className="space-y-3">
              <li><Link href="/movies" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm"><Film className="w-4 h-4" /> Movies</Link></li>
              <li><Link href="/tv" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm"><Tv className="w-4 h-4" /> TV Shows</Link></li>
              <li><Link href="/anime" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm"><Play className="w-4 h-4" /> Anime</Link></li>
              <li><Link href="/platforms" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm"><Search className="w-4 h-4" /> Platforms</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm"><FileText className="w-4 h-4" /> Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-foreground text-lg">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm"><FileText className="w-4 h-4" /> Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm"><ShieldAlert className="w-4 h-4" /> Privacy Policy</Link></li>
              <li><Link href="/dmca" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm"><ShieldAlert className="w-4 h-4" /> DMCA</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-sm"><Mail className="w-4 h-4" /> Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-foreground text-lg">Disclaimer</h4>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Star King OTT does not host any files on our server. We only link to media which is hosted on 3rd party services. If you have any legal issues please contact the appropriate media file owners or host sites.
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Star King OTT. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Made for entertainment purposes</span>
          </div>
        </div>
      </div>
    </footer>
  );
}