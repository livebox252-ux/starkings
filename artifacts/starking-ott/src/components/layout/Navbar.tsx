import { Link, useLocation } from "wouter";
import { Search, Film, Tv, Crown, Play, Menu, X, Send, Palette, Sun, Moon, LayoutGrid, MonitorPlay, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme, Theme, AccentColor, PosterStyle } from "@/context/ThemeContext";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme, accent, setAccent, posterStyle, setPosterStyle } = useTheme();
  
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/movies", label: "Movies", icon: Film },
    { href: "/tv", label: "TV Shows", icon: Tv },
    { href: "/anime", label: "Anime", icon: Play },
    { href: "/platforms", label: "Platforms", icon: MonitorPlay },
    { href: "/blog", label: "Blog", icon: BookOpen },
  ];

  const accents: { value: AccentColor, colorClass: string, label: string }[] = [
    { value: "gold", colorClass: "bg-[#f59e0b]", label: "Gold" },
    { value: "blue", colorClass: "bg-[#3b82f6]", label: "Blue" },
    { value: "red", colorClass: "bg-[#ef4444]", label: "Red" },
    { value: "green", colorClass: "bg-[#10b981]", label: "Green" },
    { value: "purple", colorClass: "bg-[#8b5cf6]", label: "Purple" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-40 transition-all duration-500",
          isScrolled 
            ? "bg-background/90 backdrop-blur-xl border-b border-border/50 py-3 shadow-lg" 
            : "bg-gradient-to-b from-black/90 via-black/50 to-transparent py-6 border-b border-transparent dark"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group z-50">
            <Crown className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
            <span className={cn("font-serif text-2xl font-bold tracking-tight hidden sm:block", 
                isScrolled ? "text-foreground" : "text-white"
            )}>
              Star King
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const active = location === link.href || (link.href !== '/' && location.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-semibold transition-all duration-300 hover:text-primary flex items-center gap-2",
                    active 
                      ? "text-primary scale-105" 
                      : (isScrolled ? "text-foreground/80 hover:text-primary" : "text-white/80 hover:text-white")
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 z-50">
            <Link href="/search" className={cn("flex items-center justify-center w-10 h-10 rounded-full transition-colors",
              isScrolled ? "hover:bg-muted text-foreground" : "hover:bg-white/10 text-white"
            )}>
              <Search className="w-5 h-5" />
            </Link>
            
            {/* Drawer Toggle */}
            <button 
              className={cn("flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                isScrolled ? "hover:bg-muted text-foreground" : "hover:bg-white/10 text-white"
              )}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Drawer Overlay */}
      <div 
        className={cn("fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300", 
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )} 
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Slide-out Drawer */}
      <div className={cn("fixed top-0 right-0 h-[100dvh] w-[320px] max-w-full bg-background border-l border-border z-50 shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-4 flex items-center justify-between border-b border-border">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-primary" />
            <span className="font-serif text-xl font-bold">Star King</span>
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const active = location === link.href || (link.href !== '/' && location.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-lg font-bold p-3 rounded-xl flex items-center gap-4 transition-all",
                    active 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <link.icon className={cn("w-5 h-5", active ? "text-primary" : "opacity-70")} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Theme Customizer Section */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4" /> Appearance
            </h4>
            
            <div className="space-y-3">
              <p className="text-sm font-medium">Theme</p>
              <div className="flex bg-muted rounded-lg p-1">
                <button 
                  onClick={() => setTheme('light')}
                  className={cn("flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all", 
                    theme === 'light' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Sun className="w-4 h-4" /> Light
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={cn("flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all", 
                    theme === 'dark' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Moon className="w-4 h-4" /> Dark
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Accent Color</p>
              <div className="flex flex-wrap gap-3">
                {accents.map((acc) => (
                  <button
                    key={acc.value}
                    onClick={() => setAccent(acc.value)}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110",
                      acc.colorClass,
                      accent === acc.value ? "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110" : ""
                    )}
                    aria-label={`Set accent to ${acc.label}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Poster Style</p>
              <div className="flex bg-muted rounded-lg p-1">
                <button 
                  onClick={() => setPosterStyle('portrait')}
                  className={cn("flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all", 
                    posterStyle === 'portrait' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" /> Portrait
                </button>
                <button 
                  onClick={() => setPosterStyle('landscape')}
                  className={cn("flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all", 
                    posterStyle === 'landscape' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <MonitorPlay className="w-4 h-4" /> Landscape
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Telegram Footer inside Drawer */}
        <div className="p-6 bg-muted/30 border-t border-border mt-auto">
          <a 
            href="https://t.me/starskingsye" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#2AABEE] hover:bg-[#229ED9] text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-[#2AABEE]/20"
          >
            <Send className="w-5 h-5" />
            Join Telegram
          </a>
        </div>
      </div>
    </>
  );
}
