import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Play, Info } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface HeroItem {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  media_type?: 'movie' | 'tv';
}

interface HeroParallaxProps {
  items: HeroItem[];
}

export function HeroParallax({ items }: HeroParallaxProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!items || items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [items]);

  if (!items || items.length === 0) return null;

  const currentItem = items[activeIndex];
  const displayTitle = currentItem.title || currentItem.name;
  const linkHref = `/watch/${currentItem.media_type || 'movie'}/${currentItem.id}`;

  const handleMouseMove = (e: React.MouseEvent) => {
    // Calculate relative mouse position (-1 to 1)
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width) * 2 - 1;
    const y = ((clientY - top) / height) * 2 - 1;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div 
      className="relative w-full min-h-[80vh] md:min-h-[90vh] bg-black overflow-hidden flex items-center dark"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Layer with crossfade */}
      {items.map((item, idx) => (
        <div 
          key={`bg-${item.id}`}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            idx === activeIndex ? "opacity-40" : "opacity-0"
          )}
        >
          <img 
            src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Heavy Gradients to blend into page */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-20 pt-20 pb-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Text Side */}
          <div className="w-full lg:w-1/2 text-left space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-wider uppercase border border-primary/30 backdrop-blur-sm mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
              #1 in {currentItem.media_type === 'tv' ? 'TV Shows' : 'Movies'} Today
            </div>
            
            <h1 
              key={`title-${currentItem.id}`}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-shadow font-serif tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100"
            >
              {displayTitle}
            </h1>
            
            <p 
              key={`desc-${currentItem.id}`}
              className="text-lg md:text-xl text-white/80 line-clamp-3 md:line-clamp-4 text-shadow max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200"
            >
              {currentItem.overview}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <Button asChild size="lg" className="h-14 px-8 text-lg font-bold rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all">
                <Link href={linkHref}>
                  <Play className="w-5 h-5 mr-2 fill-current" /> Play Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-bold rounded-full bg-white/5 hover:bg-white/10 border-white/20 text-white backdrop-blur shadow-lg hover:scale-105 transition-all">
                <Link href={linkHref}>
                  <Info className="w-5 h-5 mr-2" /> More Info
                </Link>
              </Button>
            </div>
          </div>

          {/* 3D Stack Side */}
          <div className="hidden lg:flex w-full lg:w-1/2 justify-end items-center h-[500px] hero-3d-container relative perspective-[2000px]">
            {items.map((item, idx) => {
              // Calculate relative position to active index
              let diff = idx - activeIndex;
              // Handle wrap around
              if (diff < -2) diff += items.length;
              if (diff > 2) diff -= items.length;
              
              // Only render items close to active
              if (Math.abs(diff) > 2) return null;
              
              const isActive = diff === 0;
              
              // Apply parallax based on mouse
              const parallaxX = isActive ? mousePos.x * 20 : 0;
              const parallaxY = isActive ? mousePos.y * 20 : 0;
              const rotateX = isActive ? mousePos.y * -10 : 0;
              const rotateY = isActive ? mousePos.x * 10 - (diff * 15) : (diff * -20);
              
              const translateZ = diff === 0 ? 100 : -Math.abs(diff) * 150;
              const translateX = diff * 120 + parallaxX;
              
              return (
                <div 
                  key={`card-${item.id}`}
                  className="absolute left-1/2 top-1/2 -ml-[160px] -mt-[240px] w-[320px] h-[480px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ease-out border border-white/10"
                  style={{
                    transform: `translate3d(${translateX}px, ${parallaxY}px, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                    opacity: 1 - Math.abs(diff) * 0.3,
                    zIndex: 10 - Math.abs(diff),
                    filter: `brightness(${100 - Math.abs(diff) * 30}%)`,
                  }}
                  onClick={() => setActiveIndex(idx)}
                >
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {isActive && <div className="absolute inset-0 ring-2 ring-primary ring-inset rounded-2xl" />}
                  {!isActive && <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors cursor-pointer" />}
                </div>
              );
            })}
          </div>

        </div>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-30">
        {items.map((_, index) => (
          <button
            key={index}
            className={cn("h-1.5 rounded-full transition-all duration-500",
              index === activeIndex ? "w-10 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" : "w-3 bg-white/30 hover:bg-white/60"
            )}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="w-full min-h-[80vh] md:min-h-[90vh] bg-muted animate-pulse flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      <div className="container mx-auto px-4 md:px-6 relative z-10 space-y-6 w-full lg:w-1/2 mr-auto">
        <div className="h-6 w-32 bg-background/20 rounded-full" />
        <div className="h-16 w-3/4 bg-background/20 rounded-lg" />
        <div className="h-24 w-full bg-background/20 rounded-lg" />
        <div className="flex gap-4">
          <div className="h-14 w-40 bg-background/20 rounded-full" />
          <div className="h-14 w-40 bg-background/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
