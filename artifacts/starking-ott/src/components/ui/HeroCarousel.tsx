import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState, useCallback } from "react";
import { Link } from "wouter";
import { Play, Info } from "lucide-react";
import { Button } from "./button";

interface HeroItem {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  backdrop_path?: string | null;
  media_type?: 'movie' | 'tv';
}

interface HeroCarouselProps {
  items: HeroItem[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  
  // Auto scroll
  useEffect(() => {
    const timer = setInterval(() => {
      scrollNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [scrollNext]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] bg-black">
      <div className="overflow-hidden w-full h-full" ref={emblaRef}>
        <div className="flex w-full h-full">
          {items.map((item, index) => {
            const isSelected = index === selectedIndex;
            const displayTitle = item.title || item.name;
            const linkHref = `/watch/${item.media_type || 'movie'}/${item.id}`;
            
            return (
              <div key={item.id} className="relative flex-[0_0_100%] h-full">
                {/* Backdrop Image */}
                <div className="absolute inset-0">
                  <img 
                    src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                    alt={displayTitle}
                    className="w-full h-full object-cover opacity-60"
                  />
                  {/* Cinematic Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4 md:px-6 pt-20">
                    <div className="max-w-2xl text-left transition-all duration-1000 ease-out translate-y-0 opacity-100">
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 text-shadow font-serif tracking-tight leading-tight">
                        {displayTitle}
                      </h1>
                      <p className="text-lg md:text-xl text-white/80 mb-8 line-clamp-3 md:line-clamp-4 text-shadow max-w-xl">
                        {item.overview}
                      </p>
                      <div className="flex flex-wrap items-center gap-4">
                        <Button asChild size="lg" className="h-14 px-8 text-lg font-bold rounded-full">
                          <Link href={linkHref}>
                            <Play className="w-5 h-5 mr-2 fill-current" /> Play Now
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-bold rounded-full bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur">
                          <Link href={linkHref}>
                            <Info className="w-5 h-5 mr-2" /> More Info
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2 z-10">
        {items.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === selectedIndex ? "w-8 bg-primary" : "w-2 bg-white/40"
            }`}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="w-full h-[70vh] md:h-[85vh] bg-muted animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
