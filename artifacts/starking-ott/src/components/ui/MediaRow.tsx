import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface MediaRowProps {
  title: string;
  children: React.ReactNode;
}

export function MediaRow({ title, children }: MediaRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth, scrollLeft } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="py-6 relative group">
      <h2 className="text-xl md:text-2xl font-bold mb-6 px-4 md:px-6 tracking-tight text-white">
        {title}
      </h2>
      
      <div className="relative">
        {/* Left fade/button */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 flex items-center justify-start opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none md:pointer-events-auto">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-12 w-12 rounded-full bg-black/50 backdrop-blur hover:bg-primary hover:text-black text-white ml-2 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
        </div>

        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-5 px-4 md:px-6 overflow-x-auto no-scrollbar pb-6 pt-2 snap-x snap-mandatory"
        >
          {children}
        </div>

        {/* Right fade/button */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none md:pointer-events-auto">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-12 w-12 rounded-full bg-black/50 backdrop-blur hover:bg-primary hover:text-black text-white mr-2 opacity-0 group-hover:opacity-100 transition-all translate-x-[10px] group-hover:translate-x-0"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </div>
  );
}
